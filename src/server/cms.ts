import ClientCMS from '@vtex/client-cms'
import type { Locator, ContentData } from '@vtex/client-cms'

import config from '../../store.config'

export const clientCMS = new ClientCMS({
  workspace: config.api.workspace,
  tenant: config.api.storeId,
})

type Options =
  | Locator
  | {
      contentType: string
      filters?: Record<string, string>
    }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isLocator = (x: any): x is Locator =>
  typeof x.contentType === 'string' &&
  (typeof x.releaseId === 'string' || typeof x.documentId === 'string')

export const getPage = <T extends ContentData>(options: Options) => {
  const page = isLocator(options)
    ? clientCMS.getCMSPage(options)
    : clientCMS
        .getCMSPagesByContentType(options.contentType, options.filters)
        .then((pages) => pages.data[0])

  return page as Promise<T>
}

export type PageContentType = ContentData & {
  settings: {
    seo: {
      slug: string
      title: string
      description: string
      canonical?: string
    }
  }
}
