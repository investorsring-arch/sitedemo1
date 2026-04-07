import fs from 'fs'
import path from 'path'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const file = path.join(process.cwd(), 'public', 'tools', 'reference-logistique.html')
  const html = fs.readFileSync(file, 'utf8')
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.status(200).send(html)
}
