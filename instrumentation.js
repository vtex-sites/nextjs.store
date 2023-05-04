async function register() {
  // if (process.env.NEXT_RUNTIME === 'nodejs') {
  const { setupTracerProvider } = await import('./src/instrumentation/node.mjs')

  setupTracerProvider()
  // }
}

register()
