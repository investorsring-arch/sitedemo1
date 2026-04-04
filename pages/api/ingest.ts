import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";
const pdfParse = require("pdf-parse");
import Anthropic from "@anthropic-ai/sdk";
import { embed, insertChunk } from "../../lib/services";
import { EXTRACTION_PROMPT } from "../../lib/agent/prompts";
import type { CirculaireExtracted, IngestResult } from "../../lib/types";

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

const anthropic    = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const CLAUDE_MODEL = "claude-sonnet-4-6";
const MAX_FILES    = 20;
const MAX_FILE_MB  = 15;

// ── System prompt — force JSON pur sans markdown ──────────────────────────────
const SYSTEM_JSON = `Tu es un extracteur de données pour des documents douaniers marocains.
Tu réponds UNIQUEMENT avec un objet JSON valide et rien d'autre.
Règles absolues :
- La réponse commence par { et se termine par }
- Aucun texte avant ou après le JSON
- Aucune balise markdown, aucun \`\`\`, aucun # titre
- Si une information est absente du document, utilise null
- Le champ "numero" peut être null si le document n'a pas de numéro de circulaire`;

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
}

// ── Normalise une date en ISO YYYY-MM-DD ─────────────────────────────────────
// Gère : "27 JUIN 1995", "27/06/1995", "27-06-1995", "27 juin 1995", "2022-06-20"
const FR_MONTHS: Record<string, string> = {
  janvier:'01', février:'02', fevrier:'02', mars:'03', avril:'04',
  mai:'05', juin:'06', juillet:'07', août:'08', aout:'08',
  septembre:'09', octobre:'10', novembre:'11', décembre:'12', decembre:'12',
};
function normalizeDate(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const s = raw.trim();

  // Déjà au format ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // Format JJ/MM/AAAA ou JJ-MM-AAAA
  const slashMatch = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (slashMatch) {
    const [, d, m, y] = slashMatch;
    return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
  }

  // Format "27 JUIN 1995" ou "27 juin 1995"
  const frMatch = s.match(/^(\d{1,2})\s+([A-Za-zÀ-ÖØ-öø-ÿ]+)\s+(\d{4})$/);
  if (frMatch) {
    const [, d, monthStr, y] = frMatch;
    const m = FR_MONTHS[monthStr.toLowerCase()];
    if (m) return `${y}-${m}-${d.padStart(2,'0')}`;
  }

  // Format "JUIN 1995" (sans jour)
  const frShort = s.match(/^([A-Za-zÀ-ÖØ-öø-ÿ]+)\s+(\d{4})$/);
  if (frShort) {
    const [, monthStr, y] = frShort;
    const m = FR_MONTHS[monthStr.toLowerCase()];
    if (m) return `${y}-${m}-01`;
  }

  // Format "1995" (année seule)
  if (/^\d{4}$/.test(s)) return `${s}-01-01`;

  console.warn(`[Ingest] ⚠ Date non normalisée : "${raw}" → null`);
  return null;
}

// ── Génère un identifiant depuis le nom de fichier quand numero est absent ────
function fallbackNumero(fileName: string): string {
  const base = fileName
    .replace(/\.pdf$/i, "")
    .replace(/[^a-zA-Z0-9\u00C0-\u017E]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60)
    .toUpperCase();
  return `DOC-${base}-${Date.now()}`;
}

// ── Objet minimal quand toute extraction échoue ───────────────────────────────
function buildFallbackExtracted(fileName: string, rawText = ""): CirculaireExtracted {
  const numero = fallbackNumero(fileName);
  const objet  = fileName
    .replace(/\.pdf$/i, "")
    .replace(/[_,;.-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim() || "Document douanier";

  return {
    numero,
    date:           null,
    objet,
    categorie:      "Non classé",
    mots_cles:      [],
    references:     [],
    abroge:         null,
    modifie:        null,
    resume:         rawText.slice(0, 500).trim() || `Document ingéré sans extraction textuelle. Fichier : ${fileName}`,
    sections:       [],
    fichier_source: fileName,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const ingestKey = req.headers["x-ingest-key"];
  if (process.env.INGEST_SECRET_KEY && ingestKey !== process.env.INGEST_SECRET_KEY) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  const form = formidable({ multiples: true, maxFileSize: MAX_FILE_MB * 1024 * 1024 });
  const [, files] = await form.parse(req);
  const uploaded  = (files.files ?? []) as File[];

  if (!uploaded.length) return res.status(400).json({ error: "Aucun fichier fourni" });
  if (uploaded.length > MAX_FILES) return res.status(400).json({ error: `Maximum ${MAX_FILES} fichiers par lot` });

  const results: IngestResult[] = [];
  for (const file of uploaded) {
    results.push(await processFile(file));
    await sleep(1200);
  }

  const success = results.filter((r) => r.status === "success").length;
  const skipped = results.filter((r) => r.status === "skipped").length;
  const errors  = results.filter((r) => r.status === "error").length;

  return res.status(200).json({
    summary: { total: uploaded.length, success, skipped, errors },
    results,
  });
}

async function processFile(file: File): Promise<IngestResult> {
  const fileName = file.originalFilename ?? file.newFilename;
  try {
    if (!fileName.toLowerCase().endsWith(".pdf")) {
      throw new Error("Format non supporté (PDF uniquement)");
    }

    // ── Lecture du texte PDF — jamais bloquant ────────────────────────────────
    const buffer = fs.readFileSync(file.filepath);
    let rawText  = "";
    try {
      const pdfData = await pdfParse(buffer);
      rawText = cleanText(pdfData.text ?? "");
    } catch {
      console.warn(`[Ingest] ⚠ pdf-parse échoué pour ${fileName} — on continue sans texte`);
    }

    const isScan = rawText.length < 100;
    if (isScan) {
      console.warn(`[Ingest] ⚠ PDF probablement scanné (${rawText.length} chars) : ${fileName}`);
    }

    // ── Extraction Claude avec fallback complet ───────────────────────────────
    const extracted = await extractWithClaude(rawText, fileName);

    // ── Vérification doublon ──────────────────────────────────────────────────
    const supabase = getSupabase();
    const { data: existing } = await supabase
      .from("circulaires")
      .select("id, numero, fichier_source")
      .eq("numero", extracted.numero)
      .maybeSingle();

    if (existing) {
      console.log(`[Ingest] SKIP ${fileName} — N°${extracted.numero} déjà en base`);
      return {
        fichier: fileName,
        status:  "skipped",
        numero:  extracted.numero,
        error:   `Déjà ingérée — N°${extracted.numero} (source: ${existing.fichier_source ?? "inconnue"})`,
      };
    }

    // ── Insertion circulaire ──────────────────────────────────────────────────
    const { data: newCirc, error: insertError } = await supabase
      .from("circulaires")
      .insert({
        numero:         extracted.numero,
        date:           normalizeDate(extracted.date),   // ← normalisation ISO
        objet:          extracted.objet,
        categorie:      extracted.categorie,
        mots_cles:      extracted.mots_cles,
        refs:           extracted.references,
        abroge:         extracted.abroge,
        modifie:        extracted.modifie,
        resume:         extracted.resume,
        fichier_source: fileName,
      })
      .select("id")
      .single();

    if (insertError) throw new Error(`insertCirculaire: ${insertError.message}`);
    const circulaireId = newCirc.id as string;

    // ── Insertion chunks — protection totale contre contenu undefined ─────────
    const sections = [
      { titre: "Résumé et objet", contenu: [extracted.objet, extracted.resume].filter(Boolean).join("\n\n") },
      ...(extracted.sections ?? []),
    ].filter((s) => typeof s?.contenu === "string" && s.contenu.trim().length > 0);

    let chunksInserted = 0;
    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      const embedding = await embed(
        `Circulaire ${extracted.numero} — ${sec.titre}\n${sec.contenu}`
      );
      await insertChunk({
        circulaire_id: circulaireId,
        chunk_index:   i,
        titre_section: sec.titre,
        contenu:       sec.contenu,
        embedding,
      });
      chunksInserted++;
      await sleep(150);
    }

    return {
      fichier:       fileName,
      status:        "success",
      numero:        extracted.numero,
      chunksInserted,
      ...(isScan ? { warning: "PDF scanné image — extraction textuelle partielle" } : {}),
    };

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Ingest] ❌ ${fileName}:`, msg);
    return { fichier: fileName, status: "error", error: msg };
  }
}

// ── Extraction JSON robuste ───────────────────────────────────────────────────
function extractJSON(raw: string): string {
  const s = raw
    .replace(/^```json\s*/im, "")
    .replace(/^```\s*/im, "")
    .replace(/\n?```\s*$/im, "")
    .trim();

  const start = s.indexOf("{");
  const end   = s.lastIndexOf("}");
  if (start !== -1 && end > start) return s.slice(start, end + 1);

  const rawStart = raw.indexOf("{");
  const rawEnd   = raw.lastIndexOf("}");
  if (rawStart !== -1 && rawEnd > rawStart) return raw.slice(rawStart, rawEnd + 1);

  throw new Error("Aucun objet JSON trouvé dans la réponse");
}

async function extractWithClaude(rawText: string, fileName: string): Promise<CirculaireExtracted> {
  // PDF vide ou scan : fallback direct, on n'appelle pas Claude
  if (rawText.trim().length < 50) {
    console.warn(`[Ingest] ⚠ Texte insuffisant → fallback nom de fichier : ${fileName}`);
    return buildFallbackExtracted(fileName, rawText);
  }

  // ── Appel Claude ─────────────────────────────────────────────────────────
  let rawResponse = "";
  try {
    const response = await anthropic.messages.create({
      model:      CLAUDE_MODEL,
      max_tokens: 8192,
      system:     SYSTEM_JSON,
      messages:   [{ role: "user", content: EXTRACTION_PROMPT + `\n\n---\n\n${rawText}` }],
    });
    rawResponse = (response.content[0] as { text: string }).text ?? "";
  } catch (apiErr) {
    console.warn(`[Ingest] ⚠ Erreur API Claude → fallback : ${fileName}`, apiErr);
    return buildFallbackExtracted(fileName, rawText);
  }

  // ── Parse JSON ────────────────────────────────────────────────────────────
  let parsed: Partial<CirculaireExtracted> = {};
  try {
    parsed = JSON.parse(extractJSON(rawResponse));
  } catch {
    const preview = rawResponse.slice(0, 200).replace(/\n/g, " ");
    console.warn(`[Ingest] ⚠ JSON invalide → fallback : ${fileName} | Début: ${preview}`);
    return buildFallbackExtracted(fileName, rawText);
  }

  // ── Fallbacks champ par champ — rien n'est bloquant ──────────────────────
  return {
    numero:         parsed.numero?.trim()   || fallbackNumero(fileName),
    date:           normalizeDate(parsed.date ?? null),
    objet:          parsed.objet?.trim()    || fileName.replace(/\.pdf$/i, "").replace(/[_,;.-]+/g, " ").trim(),
    categorie:      parsed.categorie        ?? "Non classé",
    mots_cles:      parsed.mots_cles        ?? [],
    references:     parsed.references       ?? [],
    abroge:         parsed.abroge           ?? null,
    modifie:        parsed.modifie          ?? null,
    resume:         parsed.resume?.trim()   || rawText.slice(0, 500) || `Document douanier : ${fileName}`,
    sections:       parsed.sections         ?? [],
    fichier_source: fileName,
  };
}

function cleanText(t: string): string {
  return t.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
