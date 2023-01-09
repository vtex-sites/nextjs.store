import type { NextApiRequest } from 'next'

export default function handler(_req: NextApiRequest, res) {
  res.status(200).send('OK')
}
