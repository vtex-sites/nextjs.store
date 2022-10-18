import ClientCMS from '@vtex/client-cms'
import type { Locator } from '@vtex/client-cms'

import config from '../../store.config'

const MIN_REQUIRED_SECTIONS = 3

export const clientCMS = new ClientCMS({
  workspace: config.api.workspace,
  tenant: config.api.storeId,
})

type Options = Locator | string

export const getPageSections = async (options: Options) => {
  const page =
    typeof options !== 'string'
      ? await clientCMS.getCMSPage(options)
      : await clientCMS
          .getCMSPagesByContentType(options)
          .then((pages) => pages.data[0])

  // Requires minimum amount of sections per page so if one bugs, the page does not render a blank screen
  if (page.sections.length < MIN_REQUIRED_SECTIONS) {
    throw new Error(
      `FastStore quality control requires at least ${MIN_REQUIRED_SECTIONS} sections per page. Please add more sections to page: "/"`
    )
  }

  return page.sections
}
