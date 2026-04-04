import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { Redis } from "@upstash/redis";
import type { ChunkResult, HistoryMessage } from "../types/index";

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
}

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
}

function getRedis() {
  return new Redis({
    url:   process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

// ── EMBEDDINGS ────────────────────────────────────────────────────────────────
export async function embed(text: string): Promise<number[]> {
  const res = await getOpenAI().embeddings.create({
    model: "text-embedding-3-small",
    input: text.slice(0, 30000),
    encoding_format: "float",
  });
  return res.data[0].embedding;
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const results: number[][] = [];
  for (let i = 0; i < texts.length; i += 100) {
    const batch = texts.slice(i, i + 100);
    const res = await getOpenAI().embeddings.create({
      model: "text-embedding-3-small",
      input: batch.map((t) => t.slice(0, 30000)),
      encoding_format: "float",
    });
    results.push(...res.data.map((d) => d.embedding));
  }
  return results;
}

// ── SUPABASE ──────────────────────────────────────────────────────────────────
export async function matchChunks(
  queryEmbedding: number[],
  opts: { threshold?: number; topK?: number; categoryFilter?: string | null } = {}
): Promise<ChunkResult[]> {
  const { threshold = 0.75, topK = 5, categoryFilter = null } = opts;
  const { data, error } = await getSupabase().rpc("match_chunks", {
    query_embedding: queryEmbedding,
    match_threshold: threshold,
    match_count:     topK,
    category_filter: categoryFilter,
  });
  if (error) { console.error("[Supabase]", error.message); return []; }
  return (data as ChunkResult[]) ?? [];
}

export async function getCirculaireByNumero(numero: string) {
  const { data } = await getSupabase()
    .from("circulaires")
    .select("*")
    .eq("numero", numero)
    .single();
  return data;
}

export async function insertCirculaire(row: Record<string, unknown>): Promise<string> {
  // UPSERT : si le numéro existe déjà, on met à jour la ligne au lieu de rejeter
  const { data, error } = await getSupabase()
    .from("circulaires")
    .upsert(row, { onConflict: "numero", ignoreDuplicates: false })
    .select("id")
    .single();
  if (error) throw new Error(`insertCirculaire: ${error.message}`);
  return data.id as string;
}

export async function insertChunk(chunk: {
  circulaire_id: string;
  chunk_index:   number;
  titre_section: string;
  contenu:       string;
  embedding:     number[];
}): Promise<void> {
  const { error } = await getSupabase().from("circulaires_chunks").insert(chunk);
  if (error) throw new Error(`insertChunk: ${error.message}`);
}

// ── REDIS — Sessions ──────────────────────────────────────────────────────────
const SESSION_TTL = 60 * 60 * 2;
const MAX_TURNS   = 6;

export async function getHistory(sessionId: string): Promise<HistoryMessage[]> {
  try {
    const raw = await getRedis().lrange<string>(`session:${sessionId}`, 0, MAX_TURNS * 2 - 1);
    return raw.map((item) => (typeof item === "string" ? JSON.parse(item) : item));
  } catch { return []; }
}

export async function saveHistory(
  sessionId: string,
  userMsg: string,
  assistantMsg: string
): Promise<void> {
  const key = `session:${sessionId}`;
  const redis = getRedis();
  const p = redis.pipeline();
  p.lpush(key, JSON.stringify({ role: "assistant", content: assistantMsg }));
  p.lpush(key, JSON.stringify({ role: "user",      content: userMsg      }));
  p.ltrim(key, 0, MAX_TURNS * 2 - 1);
  p.expire(key, SESSION_TTL);
  await p.exec();
}

export async function clearSession(sessionId: string): Promise<void> {
  await getRedis().del(`session:${sessionId}`);
}