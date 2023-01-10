import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * This is equal to the /api/health/live endpoint for lack of a better
 * implementation differentiating between them.
 */
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).send('OK')
}
