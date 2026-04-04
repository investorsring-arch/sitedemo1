import Anthropic from "@anthropic-ai/sdk";
import type {
  AgentRequest, AgentResponse,
  Intent, ChunkResult, SourceCitation,
} from "../types/index";
import {
  embed, matchChunks, getCirculaireByNumero,
  getHistory, saveHistory,
} from "../services/index";
import { formatResponse } from "./formatter";
import { SYSTEM_PROMPT_AGENT, INTENT_CLASSIFICATION_PROMPT } from "./prompts";

const anthropic  = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL      = "claude-sonnet-4-6";
const MAX_TOKENS = 1024;
const RAG_TOP_K  = 5;
const RAG_THRESH = 0.75;

// ── POINT D'ENTRÉE ────────────────────────────────────────────────────────────
export async function handleQuery(req: AgentRequest): Promise<AgentResponse> {
  const t0 = Date.now();

  const intent  = await classifyIntent(req.message);
  const chunks  = await retrieveChunks(req.message, intent);
  const history = await getHistory(req.sessionId);

 const { rawText, tokensUsed } = await callClaude(req.message, chunks, history, req.systemPrompt);

  const sources = deduplicateSources(chunks);
  const text    = formatResponse(rawText, sources, req.channel);

  saveHistory(req.sessionId, req.message, rawText).catch(console.error);

  return { text, sources, sessionId: req.sessionId, tokensUsed, latencyMs: Date.now() - t0 };
}

// ── CLASSIFICATION D'INTENTION ────────────────────────────────────────────────
async function classifyIntent(message: string): Promise<Intent> {
  try {
    const res = await anthropic.messages.create({
      model:      MODEL,
      max_tokens: 150,
      messages:   [{ role: "user", content: INTENT_CLASSIFICATION_PROMPT + message }],
    });
    const raw     = (res.content[0] as { text: string }).text.trim();
    const cleaned = raw.replace(/^```json?\n?/, "").replace(/\n?```$/, "");
    return JSON.parse(cleaned) as Intent;
  } catch {
    return { type: "general", confidence: 0.5 };
  }
}

// ── RÉCUPÉRATION RAG ──────────────────────────────────────────────────────────
async function retrieveChunks(message: string, intent: Intent): Promise<ChunkResult[]> {
  if (intent.type === "circulaire_specifique" && intent.circulaire_numero) {
    const c = await getCirculaireByNumero(intent.circulaire_numero);
    if (c) return [{
      circulaire_id: c.id, numero: c.numero, date: c.date,
      objet: c.objet, titre_section: "Vue d'ensemble",
      contenu: c.resume ?? c.objet, similarity: 1.0,
    }];
  }
  const embedding = await embed(message);
  return matchChunks(embedding, {
    threshold:      RAG_THRESH,
    topK:           RAG_TOP_K,
    categoryFilter: intent.category_filter ?? null,
  });
}

// ── APPEL CLAUDE ──────────────────────────────────────────────────────────────
async function callClaude(
  userMessage:  string,
  chunks:       ChunkResult[],
  history:      Array<{ role: "user" | "assistant"; content: string }>,
  systemPrompt?: string
): Promise<{ rawText: string; tokensUsed: number }> {

  const contextBlock = chunks.length
    ? chunks.map((c, i) =>
        `--- Document ${i + 1} ---\n` +
        `Circulaire : N°${c.numero} du ${c.date}\n` +
        `Section : ${c.titre_section}\n` +
        `Pertinence : ${(c.similarity * 100).toFixed(0)}%\n\n` +
        c.contenu
      ).join("\n\n")
    : "";

  const enrichedMessage = contextBlock
    ? `[CONTEXTE RÉGLEMENTAIRE]\n${contextBlock}\n\n[QUESTION]\n${userMessage}`
    : userMessage;

  const messages: Anthropic.MessageParam[] = [
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: "user", content: enrichedMessage },
  ];

   const response = await anthropic.messages.create({
  model:      MODEL,
  max_tokens: MAX_TOKENS,
  system:     systemPrompt ?? SYSTEM_PROMPT_AGENT,
  messages,
});

  return {
    rawText:    (response.content[0] as { text: string }).text,
    tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
  };
}

// ── DÉDUPLIQUER LES SOURCES ───────────────────────────────────────────────────
function deduplicateSources(chunks: ChunkResult[]): SourceCitation[] {
  const seen = new Set<string>();
  return chunks
    .filter((c) => { if (seen.has(c.numero)) return false; seen.add(c.numero); return true; })
    .map((c) => ({
      numero: c.numero, date: c.date, objet: c.objet,
      section: c.titre_section, similarity: c.similarity,
    }));
}