import crypto from 'crypto'

const SECRET = process.env.ADMIN_SECRET || 'fallback-dev-secret'
const TTL = parseInt(process.env.ADMIN_SESSION_TTL || '86400', 10)
export const COOKIE_NAME = 'das_admin'

export function createToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + TTL * 1000 })
  ).toString('base64url')

  const sig = crypto
    .createHmac('sha256', SECRET)
    .update(payload)
    .digest('base64url')

  return payload + '.' + sig
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false

  const parts = token.split('.')
  if (parts.length !== 2) return false

  const payload = parts[0]
  const sig = parts[1]

  const expected = crypto
    .createHmac('sha256', SECRET)
    .update(payload)
    .digest('base64url')

  try {
    const valid = crypto.timingSafeEqual(
      Buffer.from(sig),
      Buffer.from(expected)
    )
    if (!valid) return false

    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return Date.now() < decoded.exp
  } catch {
    return false
  }
}

export function parseCookie(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {}
  return Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const parts = c.trim().split('=')
      const k = parts[0].trim()
      const v = parts.slice(1).join('=')
      return [k, v]
    })
  )
}