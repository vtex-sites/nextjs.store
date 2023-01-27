// @ts-check
// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig } = require('@sentry/nextjs')

/**
 * @type {import('next').NextConfig}
 * */
const nextConfig = {
  /* config options here */
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  },
  webpack: (config, { isServer, dev }) => {
    // https://github.com/vercel/next.js/discussions/11267#discussioncomment-2479112
    // camel-case style names from css modules
    config.module.rules
      .find(({ oneOf }) => !!oneOf)
      .oneOf.filter(({ use }) => JSON.stringify(use)?.includes('css-loader'))
      .reduce((acc, { use }) => acc.concat(use), [])
      .forEach(({ options }) => {
        if (options.modules) {
          options.modules.exportLocalsConvention = 'camelCase'
        }
      })

    // Reduce the number of chunks so we ship a smaller first bundle.
    // This should help reducing TBT
    if (!isServer && !dev && config.optimization?.splitChunks) {
      config.optimization.splitChunks.maxInitialRequests = 1
    }

    return config
  },
}

module.exports = nextConfig

process.env.SENTRY_RELEASE = process.env.SENTRY_RELEASE || process.env.COMMIT_ID

module.exports = withSentryConfig(
  module.exports,
  {
    org: 'vtex',
    project: 'faststore-starter',
    authToken: process.env.SENTRY_AUTH_TOKEN,
    release: process.env.COMMIT_ID,
    // This should contain the name of your account after the trace. "faststore-account"
  },
  { hideSourceMaps: true }
)
