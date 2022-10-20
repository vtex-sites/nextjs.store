import type { ContentData } from '@vtex/client-cms'
import { useEffect, useMemo, useState } from 'react'

import type { Options } from 'src/server/cms'
import { fetchCMS } from 'src/server/cms'

export const useCMS = (options: Options) => {
  const [page, setPage] = useState<ContentData>()

  useEffect(() => {
    const fetchCMSPage = async () => {
      const result = await fetchCMS(options)
      const pageResult = await result.json()

      setPage(pageResult)
    }

    fetchCMSPage()
  }, [options])

  return useMemo(() => page, [page])
}
