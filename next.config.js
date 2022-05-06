// @ts-check

/**
 * @type {import('next').NextConfig}
 * */
const nextConfig = {
  /* config options here */
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  },
  /* enable for debug and profile at devtools */
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig
