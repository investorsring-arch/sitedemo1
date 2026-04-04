// pages/api/faq/search.ts
// API sécurisée pour la recherche FAQ
// Rate limiting : 10 requêtes / minute / session
// Renvoie uniquement les champs nécessaires (pas l'answer en masse)

import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// In-memory rate limiter (→ Redis en production)
const rateLimiter = new Map<string, { count: number; reset: number }>()
const RATE_LIMIT = 10
const RATE_WINDOW = 60 * 1000 // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimiter.get(ip)

  if (!entry || now > entry.reset) {
    rateLimiter.set(ip, { count: 1, reset: now + RATE_WINDOW })
    return true
  }

  if (entry.count >= RATE_LIMIT) return false

  entry.count++
  return true
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Méthode non autorisée' })
  }

  // Rate limiting
  const ip = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown').split(',')[0]
  if (!checkRateLimit(ip)) {
    return res.status(429).json({
      ok: false,
      error: 'Trop de requêtes. Patientez une minute.',
      retryAfter: 60
    })
  }

  // Anti-bot headers check
  const ua = req.headers['user-agent'] || ''
  const botPatterns = ['bot', 'crawler', 'spider', 'scraper', 'wget', 'curl', 'python-requests']
  if (botPatterns.some(p => ua.toLowerCase().includes(p))) {
    return res.status(403).json({ ok: false, error: 'Accès refusé' })
  }

  const {
    q = '',
    titre,
    difficulte,
    profil,
    limit = '10',
    offset = '0',
    id,
  } = req.query

  const limitN  = Math.min(parseInt(limit as string, 10) || 10, 15) // max 15 par page
  const offsetN = parseInt(offset as string, 10) || 0

  try {
    // Mode : récupérer une seule Q&A par ID (accordéon ouvert)
    if (id) {
      const { data, error } = await supabase
        .from('faq')
        .select('*')
        .eq('id', id as string)
        .single()

      if (error || !data) return res.status(404).json({ ok: false, error: 'Question introuvable' })

      // Set anti-cache headers
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
      res.setHeader('X-Content-Type-Options', 'nosniff')
      res.setHeader('X-Frame-Options', 'DENY')

      return res.status(200).json({ ok: true, data })
    }

    // Mode : liste (sans la réponse complète — chargée à l'ouverture)
    let query = supabase
      .from('faq')
      .select('id,titre,titre_label,categorie,question,tags,difficulte,profils,answer_words', { count: 'exact' })
      .order('titre', { ascending: true })
      .order('id', { ascending: true })
      .range(offsetN, offsetN + limitN - 1)

    if (titre)     query = query.eq('titre', parseInt(titre as string))
    if (difficulte) query = query.eq('difficulte', difficulte as string)
    if (profil)    query = query.contains('profils', [profil as string])
    if ((q as string).trim().length >= 2) {
      query = query.or(
        `question.ilike.%${(q as string).trim()}%,answer.ilike.%${(q as string).trim()}%`
      )
    }

    const { data, count, error } = await query

    if (error) return res.status(500).json({ ok: false, error: error.message })

    // Security headers
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('X-Robots-Tag', 'noindex, nofollow')

    return res.status(200).json({
      ok: true,
      data: {
        results: data,
        total: count || 0,
        page: Math.floor(offsetN / limitN) + 1,
        limit: limitN,
      }
    })

  } catch (err) {
    console.error('FAQ API error:', err)
    return res.status(500).json({ ok: false, error: 'Erreur serveur' })
  }
}
