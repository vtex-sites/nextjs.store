import type { ContentData } from '@vtex/client-cms'
import type { NextApiHandler } from 'next'

import { getPage } from 'src/server/cms'

import { pickParam } from './preview'

class StatusError extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

const handler: NextApiHandler = async (req, res) => {
  try {
    if (req.method !== 'GET') {
      throw new StatusError(`Only GET requests allowed`, 405)
    }

    const page = await getPage<ContentData>({
      contentType: pickParam(req, 'contentType'),
    })

    res.status(200).json(page)
  } catch (error) {
    if (error instanceof StatusError) {
      res.status(error.status).end(error.message)

      return
    }

    throw error
  }
}

export default handler
