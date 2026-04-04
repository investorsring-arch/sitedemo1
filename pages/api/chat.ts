// pages/api/chat.ts
// Douane.ia — Route de conversation principale
// Version 5.0 · Owner bypass cookie + header · Quota 100 freemium
// ─────────────────────────────────────────────────────────────────────────────

import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { Redis } from "@upstash/redis";
import { handleQuery } from "../../lib/agent/orchestrator";
import { buildSystemPrompt } from "../../lib/agent/prompts";

// ─── Types ────────────────────────────────────────────────────────────────────

type UserProfile = "transitaire" | "importateur" | "consultant" | "direction" | null;

interface SessionMeta {
  domain:  number | null;
  profile: UserProfile;
  turns:   number;
  quota:   number;
}

interface ChatRequest {
  message:    string;
  sessionId?: string;
  channel?:   string;
  language?:  string;
  domain?:    number | null;
  profile?:   UserProfile;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const OWNER_EMAIL      = "investors@gmail.com";
const OWNER_QUOTA      = 999;
const FREE_DAILY_QUOTA = 100;
const MAX_MESSAGE_LEN  = 3000;

// ─── Redis ────────────────────────────────────────────────────────────────────

let _redis: Redis | null = null;
function getRedis(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url:   process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return _redis;
}

async function getSessionMeta(sessionId: string): Promise<SessionMeta> {
  try {
    const raw = await getRedis().get<SessionMeta>(`meta:${sessionId}`);
    return raw ?? { domain: null, profile: null, turns: 0, quota: 0 };
  } catch {
    return { domain: null, profile: null, turns: 0, quota: 0 };
  }
}

async function saveSessionMeta(sessionId: string, meta: SessionMeta): Promise<void> {
  try {
    await getRedis().set(`meta:${sessionId}`, meta, { ex: 86400 });
  } catch {}
}

// ─── Détection Owner ──────────────────────────────────────────────────────────
// Priorité : 1) header x-user-email  2) cookie douane_owner  3) body email

function detectOwner(req: NextApiRequest): boolean {
  // Méthode 1 — header HTTP (envoyé par douane-chat.js après login)
  const headerEmail = req.headers["x-user-email"] as string | undefined;
  if (headerEmail === OWNER_EMAIL) return true;

  // Méthode 2 — cookie de session owner (posé par /api/login)
  const cookies = req.cookies;
  if (cookies["douane_owner"] === "1") return true;

  // Méthode 3 — body (mode dev direct)
  const bodyEmail = (req.body as Record<string, unknown>)?.userEmail as string | undefined;
  if (bodyEmail === OWNER_EMAIL) return true;

  return false;
}

// ─── Quota ────────────────────────────────────────────────────────────────────

async function checkQuota(sessionId: string, isOwner: boolean): Promise<{
  allowed: boolean;
  remaining: number;
}> {
  if (isOwner) return { allowed: true, remaining: OWNER_QUOTA };

  try {
    const dateKey   = new Date().toISOString().slice(0, 10);
    const quotaKey  = `quota:${sessionId}:${dateKey}`;
    const current   = await getRedis().get<number>(quotaKey) ?? 0;
    const remaining = FREE_DAILY_QUOTA - current;
    return { allowed: remaining > 0, remaining: Math.max(0, remaining) };
  } catch {
    return { allowed: true, remaining: FREE_DAILY_QUOTA };
  }
}

async function incrementQuota(sessionId: string): Promise<void> {
  try {
    const dateKey  = new Date().toISOString().slice(0, 10);
    const quotaKey = `quota:${sessionId}:${dateKey}`;
    const redis    = getRedis();
    await redis.incr(quotaKey);
    await redis.expire(quotaKey, 86400);
  } catch {}
}

// ─── Détection domaine depuis message ─────────────────────────────────────────

function extractDomainFromMessage(message: string): number | null {
  const match = message.trim().match(/^(?:domaine\s*|le\s*|numéro\s*|n°\s*)?([1-9]|10)\.?\s*$/i);
  return match ? parseInt(match[1], 10) : null;
}

// ─── Handler principal ────────────────────────────────────────────────────────

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const {
    message,
    sessionId,
    channel  = "web",
    language = "auto",
    domain:  clientDomain  = null,
    profile: clientProfile = null,
  } = req.body as ChatRequest;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "Le champ 'message' est requis" });
  }
  if (message.length > MAX_MESSAGE_LEN) {
    return res.status(400).json({ error: `Message trop long (max ${MAX_MESSAGE_LEN} caractères)` });
  }

  const sid     = sessionId ?? uuidv4();
  const isOwner = detectOwner(req);

  // ── Quota ──
  const { allowed, remaining } = await checkQuota(sid, isOwner);
  if (!allowed) {
    return res.status(429).json({
      error:      "Quota journalier atteint",
      remaining:  0,
      message:    `Vous avez atteint votre limite de ${FREE_DAILY_QUOTA} questions par jour en version gratuite. Passez à un abonnement pour un accès illimité.`,
      upgradeUrl: "/abonnements",
    });
  }

  // ── Session ──
  const sessionMeta   = await getSessionMeta(sid);
  const detectedDomain = extractDomainFromMessage(message.trim());
  const activeDomain: number | null = clientDomain ?? detectedDomain ?? sessionMeta.domain ?? null;
  const activeProfile: UserProfile  = clientProfile ?? sessionMeta.profile ?? null;

  // ── System Prompt v4 ──
  const systemPrompt = buildSystemPrompt({
    userProfile:      activeProfile,
    sessionDomain:    activeDomain,
    circulairesCount: undefined,
  });

  try {
    const result = await handleQuery({
      message:   message.trim(),
      sessionId: sid,
      channel,
      language,
      systemPrompt,
    });

    if (!isOwner) await incrementQuota(sid);

    await saveSessionMeta(sid, {
      domain:  activeDomain,
      profile: activeProfile,
      turns:   sessionMeta.turns + 1,
      quota:   sessionMeta.quota + 1,
    });

    return res.status(200).json({
      success:   true,
      sessionId: sid,
      response:  result.text,
      sources:   result.sources,
      meta: {
        tokensUsed:     result.tokensUsed,
        latencyMs:      result.latencyMs,
        quotaRemaining: isOwner ? OWNER_QUOTA : Math.max(0, remaining - 1),
        isOwner,
        activeDomain,
        activeProfile,
      },
    });

  } catch (err: unknown) {
    const error = err as Record<string, unknown>;
    console.error("[/api/chat] ERREUR:", JSON.stringify(error, Object.getOwnPropertyNames(error)));

    if (
      (typeof error.status === "number" && error.status === 429) ||
      (typeof error.message === "string" && error.message.includes("rate_limit"))
    ) {
      return res.status(429).json({
        error:   "Capacité momentanément dépassée",
        message: "Le service est très sollicité. Réessayez dans quelques secondes.",
      });
    }

    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
}
