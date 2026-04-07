/**
 * middleware.ts  (racine du projet Next.js)
 * ─────────────────────────────────────────────────────────────────────────────
 * Intercepte TOUTES les requêtes vers /admin/* AVANT qu'elles atteignent
 * les pages ou API routes. C'est la première ligne de défense.
 *
 * Logique :
 *   /admin/login         → toujours accessible (page de connexion)
 *   /admin/*             → vérifier cookie signé → sinon redirect /admin/login
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'das_admin'
const SECRET      = process.env.ADMIN_SECRET || 'fallback-dev-secret'

// ─── Vérification HMAC inline (middleware ne peut pas importer crypto Node) ───
// Le middleware tourne dans l'Edge Runtime (pas Node.js complet)
// On utilise l'API Web Crypto disponible dans l'Edge Runtime

async function verifyToken(token: string): Promise<boolean> {
  try {
    const parts = token.split('.')
    if (parts.length !== 2) return false
    const [payload, sig] = parts

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    const sigBytes = Uint8Array.from(
      atob(sig.replace(/-/g,'+').replace(/_/g,'/')),
      c => c.charCodeAt(0)
    )
    const payloadBytes = new TextEncoder().encode(payload)

    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, payloadBytes)
    if (!valid) return false

    const decoded = JSON.parse(atob(payload.replace(/-/g,'+').replace(/_/g,'/')))
    return Date.now() < decoded.exp
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // /admin/login → toujours laisser passer
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Toutes les autres routes /admin/* → vérifier le cookie
  const token = req.cookies.get(COOKIE_NAME)?.value

  if (!token || !(await verifyToken(token))) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    loginUrl.searchParams.set('from', pathname)   // retour après login
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// ─── Matcher : uniquement les routes /admin/* ─────────────────────────────────
export const config = {
  matcher: ['/admin/:path*'],
}
