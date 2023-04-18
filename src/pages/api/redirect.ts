import type { NextApiRequest, NextApiResponse } from 'next'

import { secureSubdomain } from 'store.config'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req.query
  const url = `${secureSubdomain}/api/io/_v/api/intelligent-search/product_search?query=${query}`

  const response = await fetch(url)
  const data = await response.json()

  data.redirect
    ? res.status(200).json({ redirect: `${data.redirect}` })
    : res.status(404).json({})
}
