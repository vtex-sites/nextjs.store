// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://06cdc0f40cc746f09cbc190161168ed8@o191317.ingest.sentry.io/4504572593111040',
  environment: process.env.NODE_ENV,
  debug: process.env.NODE_ENV === 'development',
  enabled: process.env.NODE_ENV !== 'development',
  sampleRate: 0.1,
})
