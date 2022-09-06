const lhConfig = require('@faststore/lighthouse').default

const { lighthouse: lh } = require('./store.config')

module.exports = lhConfig({
  urls: Object.values(lh.pages),
  server: lh.server,
  assertions: {
    'csp-xss': 'off',
    deprecations: 'warn',
  },
})
