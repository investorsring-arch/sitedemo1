// lib/agent/formatter.ts — Version 3.0
// Normalisation robuste : insère les sauts de ligne même si le LLM n'en génère pas
import type { Channel, SourceCitation } from "../types/index";

export function formatResponse(
  rawText: string,
  sources: SourceCitation[],
  channel: Channel
): string {
  const sourcesBlock = buildSources(sources, channel);
  switch (channel) {
    case "whatsapp": return formatWA(rawText, sourcesBlock);
    case "mobile":   return formatMobile(rawText, sourcesBlock);
    default:         return formatWeb(rawText, sourcesBlock);
  }
}

// ─── Canal web ────────────────────────────────────────────────────────────────

function formatWeb(text: string, sources: string): string {
  const formatted = normalizeForWeb(text);
  return sources ? `${formatted}\n\n---\n\n${sources}` : formatted;
}

function normalizeForWeb(text: string): string {
  return text
    // Insérer \n\n avant chaque **N.** (avec ou sans \n existant, avec ou sans espace)
    .replace(/\s+(\*\*\d{1,2}\.\*\*)/g, "\n\n$1")
    // Insérer \n\n avant chaque N. numéroté simple (1. 2. ... 10.)
    .replace(/([?!.»])\s+(\d{1,2}\.\s)/g, "$1\n\n$2")
    // Insérer \n\n avant les → (flèches de conclusion / instruction)
    .replace(/\s+(→)/g, "\n\n$1")
    // Insérer \n\n avant les ── séparateurs de section
    .replace(/\s+(──+)/g, "\n\n$1")
    // Réduire les triples sauts de ligne en double
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ─── Canal WhatsApp ───────────────────────────────────────────────────────────

function formatWA(text: string, sources: string): string {
  let r = normalizeForWeb(text);    // même normalisation
  r = stripMarkdown(r);
  r = r.replace(/\*\*(.*?)\*\*/g, "*$1*");
  if (sources) r += `\n\n${sources}`;
  if (r.length > 1500)
    r = r.slice(0, 1450) + "\n\n_(réponse tronquée — voir l'app web)_";
  return r;
}

// ─── Canal mobile ─────────────────────────────────────────────────────────────

function formatMobile(text: string, sources: string): string {
  const formatted = normalizeForWeb(text);
  return sources ? `${formatted}\n\n---\n${sources}` : formatted;
}

// ─── Bloc sources ─────────────────────────────────────────────────────────────

function buildSources(sources: SourceCitation[], channel: Channel): string {
  if (!sources.length) return "";
  if (channel === "whatsapp") {
    return "📋 *Sources :*\n" +
      sources.map((s) => `• N°${s.numero} (${fmtDate(s.date)}) — ${s.section}`).join("\n");
  }
  if (channel === "mobile") {
    return "**Sources :**\n" +
      sources.map((s) => `• **${s.numero}** (${fmtDate(s.date)}) — ${s.section}`).join("\n");
  }
  return "**Références réglementaires :**\n\n" +
    sources.map((s) =>
      `> 📋 **Circulaire N°${s.numero}** — *${s.objet.slice(0, 70)}*\n` +
      `> Section : ${s.section} | Date : ${fmtDate(s.date)}`
    ).join("\n\n");
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripMarkdown(t: string): string {
  return t
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s*[-*+]\s/gm, "• ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
