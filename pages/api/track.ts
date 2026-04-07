/**
 * pages/api/track.ts — v2
 * Proxy Shipsgo v2 API (endpoints corrects)
 *
 * Documentation Shipsgo v2 :
 * - Ocean POST : POST https://api.shipsgo.com/v2/shipments
 * - Ocean GET  : GET  https://api.shipsgo.com/v2/shipments/{id}
 * - Air POST   : POST https://api.shipsgo.com/v2/air-shipments
 * - Air GET    : GET  https://api.shipsgo.com/v2/air-shipments?awb=
 *
 * Fallback v1.2 (ancienne doc) si v2 échoue :
 * - POST https://shipsgo.com/api/v1.2/ContainerService/AddShipment
 * - GET  https://shipsgo.com/api/v1.2/ContainerService/GetContainerInfo/
 */

import type { NextApiRequest, NextApiResponse } from 'next'

const KEY  = process.env.SHIPSGO_API_KEY || ''
const V2   = 'https://api.shipsgo.com/v2'
const V1   = 'https://shipsgo.com/api/v1.2'

function detectType(q: string): 'awb' | 'bl' | 'container' | 'unknown' {
  const v = q.trim().replace(/[-\s]/g, '')
  if (/^\d{11}$/.test(v))              return 'awb'
  if (/^[A-Z]{4}\d{7}$/i.test(v))     return 'container'
  if (/^[A-Z]{2,4}\d{6,12}$/i.test(v)) return 'bl'
  return 'unknown'
}

// ─── Maritime v2 ─────────────────────────────────────────────────────────────
async function trackMaritimeV2(ref: string, type: 'bl' | 'container') {
  // Essai v2 d'abord
  try {
    const body: any = { authCode: KEY }
    if (type === 'bl')        body.blContainersRef = ref
    else                      body.containerNumber = ref
    body.shippingLine = 'OTHERS'

    const r = await fetch(`${V2}/shipments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
      body: JSON.stringify(body),
    })
    const d = await r.json()

    if (r.ok && d && !d.message?.includes('not found')) {
      // GET le détail si on a un id
      const id = d.id || d.shipmentId
      if (id) {
        const r2 = await fetch(`${V2}/shipments/${id}`, {
          headers: { 'Authorization': `Bearer ${KEY}` }
        })
        const d2 = await r2.json()
        return { source: 'v2', type: 'maritime', ref, data: d2 }
      }
      return { source: 'v2', type: 'maritime', ref, data: d }
    }
  } catch {}

  // Fallback v1.2
  const body = new URLSearchParams({ authCode: KEY, shippingLine: 'OTHERS' })
  if (type === 'bl')   body.append('blContainersRef', ref)
  else                 body.append('containerNumber', ref)

  const r = await fetch(`${V1}/ContainerService/AddShipment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
  const d = await r.json()

  const requestId = typeof d === 'number' ? d : d?.requestId || d?.RequestId
  if (requestId && !isNaN(Number(requestId))) {
    const r2 = await fetch(`${V1}/ContainerService/GetContainerInfo/?authCode=${KEY}&requestId=${requestId}&mapPoint=true`)
    const d2 = await r2.json()
    return { source: 'v1.2', type: 'maritime', ref, requestId, data: d2 }
  }

  // Dernier recours : GET direct avec le numéro
  const r3 = await fetch(`${V1}/ContainerService/GetContainerInfo/?authCode=${KEY}&requestId=${ref}&mapPoint=true`)
  const d3 = await r3.json()
  return { source: 'v1.2-direct', type: 'maritime', ref, data: d3 }
}

// ─── Aérien v2 ───────────────────────────────────────────────────────────────
async function trackAirV2(awb: string) {
  // Essai v2
  try {
    const r = await fetch(`${V2}/air-shipments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
      body: JSON.stringify({ awbNumber: awb, authCode: KEY }),
    })
    const d = await r.json()

    if (r.ok && d && !d.message?.includes('not found')) {
      const r2 = await fetch(`${V2}/air-shipments?awb=${awb}`, {
        headers: { 'Authorization': `Bearer ${KEY}` }
      })
      const d2 = await r2.json()
      return { source: 'v2', type: 'air', awb, data: d2 }
    }
  } catch {}

  // Fallback v1.2 air
  try {
    const body = new URLSearchParams({ authCode: KEY, awbNumber: awb })
    const r = await fetch(`${V1}/AirShipmentService/AddShipment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
    const d = await r.json()
    const r2 = await fetch(`${V1}/AirShipmentService/GetShipment?authCode=${KEY}&awbNumber=${awb}`)
    const d2 = await r2.json()
    return { source: 'v1.2', type: 'air', awb, addResult: d, data: d2 }
  } catch {}

  // Dernier recours — GET direct
  const r = await fetch(`${V1}/AirShipmentService/GetShipment?authCode=${KEY}&awbNumber=${awb}`)
  const d = await r.json()
  return { source: 'v1.2-direct', type: 'air', awb, data: d }
}

// ─── Handler ─────────────────────────────────────────────────────────────────
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { q } = req.body
  if (!q?.trim()) return res.status(400).json({ error: 'Référence requise' })
  if (!KEY)       return res.status(500).json({ error: 'SHIPSGO_API_KEY non configurée' })

  const clean = q.trim().replace(/[-\s]/g, '')
  const type  = detectType(q)

  if (type === 'unknown') {
    return res.status(400).json({
      error: 'Format non reconnu. Saisissez un AWB (11 chiffres), un BL ou un numéro de conteneur (4 lettres + 7 chiffres).'
    })
  }

  try {
    const result = type === 'awb'
      ? await trackAirV2(clean)
      : await trackMaritimeV2(clean, type)

    return res.status(200).json({ ok: true, type, query: clean, result })
  } catch (err: any) {
    return res.status(500).json({ error: 'Erreur serveur', detail: err?.message })
  }
}
