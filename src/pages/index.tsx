import { NextSeo, SiteLinksSearchBoxJsonLd } from 'next-seo'
import type { ContentData } from '@vtex/client-cms'

import RenderPageSections from 'src/components/cms/RenderPageSections'
import { mark } from 'src/sdk/tests/mark'
import { clientCMS } from 'src/cms/client'
import cmsHomeFallback from 'src/cms/cmsHomeFallback'

import storeConfig from '../../store.config'

export type Props = { cmsHome: ContentData }

function Page({ cmsHome }: Props) {
  return (
    <>
      {/* SEO */}
      <NextSeo
        title={storeConfig.seo.title}
        description={storeConfig.seo.description}
        titleTemplate={storeConfig.seo.titleTemplate}
        canonical={storeConfig.storeUrl}
        openGraph={{
          type: 'website',
          url: storeConfig.storeUrl,
          title: storeConfig.seo.title,
          description: storeConfig.seo.description,
        }}
      />
      <SiteLinksSearchBoxJsonLd
        url={storeConfig.storeUrl}
        potentialActions={[
          {
            target: `${storeConfig.storeUrl}/s/?q={search_term_string}`,
            queryInput: 'required name=search_term_string',
          },
        ]}
      />

      {/*
        WARNING: Do not import or render components from any
        other folder than '../components/sections' in here.

        This is necessary to keep the integration with the CMS
        easy and consistent, enabling the change and reorder
        of elements on this page.

        If needed, wrap your component in a <Section /> component
        (not the HTML tag) before rendering it here.
      */}
      <RenderPageSections sections={cmsHome.sections} />
    </>
  )
}

export async function getStaticProps() {
  const locatorCMS = {
    contentType: 'home',
    documentId: 'ad2fd81d-a53c-4281-8d01-a4fc2f274db3',
    versionId: '1b18fbcf-ce08-4ead-9011-364921e725c3',
  }

  try {
    const cmsHome = await clientCMS.getCMSPage(locatorCMS)

    return {
      props: { cmsHome },
    }
  } catch (error) {
    console.error(
      `Missing '${locatorCMS.contentType}' data from CMS. To prevent this warning, open https://storeframework.myvtex.com/admin/new-cms and create a new content from the 'home' template. Falling back to default home template`,
      error
    )

    return {
      props: { cmsHome: cmsHomeFallback },
    }
  }
}

Page.displayName = 'Page'
export default mark(Page)
