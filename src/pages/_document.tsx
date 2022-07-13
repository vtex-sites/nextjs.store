import { Head, Html, Main, NextScript } from 'next/document'

import ThirdPartyScripts from 'src/components/ThirdPartyScripts'
import storeConfig from 'store.config'

function Document() {
  return (
    <Html>
      <Head>{!process.env.DISABLE_3P_SCRIPTS && <ThirdPartyScripts />}</Head>
      <body className={`${storeConfig.theme}`}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
