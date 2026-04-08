import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.json({
    password_set: !!process.env.ADMIN_PASSWORD,
    password_length: process.env.ADMIN_PASSWORD?.length,
    first_chars: process.env.ADMIN_PASSWORD?.substring(0, 4),
  })
}
