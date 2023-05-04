// Import the required OpenTelemetry libraries and plugins
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base'
import { Resource } from '@opentelemetry/resources'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { CompressionAlgorithm } from '@opentelemetry/otlp-exporter-base'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'

import storeConfig from '../../store.config'

let tracerProvider = null

export function setupTracerProvider() {
  const collectorOptions = {
    // url is optional and can be omitted - default is http://localhost:4317
    url: 'opentelemetry-collector-beta.vtex.systems',
    compression: CompressionAlgorithm.GZIP,
  }

  // Create a new tracer provider
  const localTraceProvider = new NodeTracerProvider({
    resource: Resource.default().merge(
      new Resource({
        'service.name': 'faststore-api',
        'service.version': '1.12.38',
        'service.name_and_version': 'faststore-api@1.12.38',
        platform: storeConfig.platform,
        [`${storeConfig.platform}.account`]: storeConfig.api.storeId,
        [`${storeConfig.platform}.workspace`]: storeConfig.api.workspace,
        [`${storeConfig.platform}.environment`]: storeConfig.api.environment,
      })
    ),
  })

  // Create a new exporter
  const exporter = new OTLPTraceExporter(collectorOptions)

  // Set up a span processor to export spans to Honeycomb
  const spanProcessor = new SimpleSpanProcessor(exporter)

  // Set up a console exporter for debugging purposes
  const consoleExporter = new ConsoleSpanExporter()
  const debugProcessor = new SimpleSpanProcessor(consoleExporter)

  // Register the span processors with the tracer provider
  localTraceProvider.addSpanProcessor(spanProcessor)
  localTraceProvider.addSpanProcessor(debugProcessor)

  // Register the tracer provider with the OpenTelemetry API
  localTraceProvider.register()

  registerInstrumentations({
    instrumentations: [getNodeAutoInstrumentations()],
    tracerProvider: localTraceProvider,
  })

  tracerProvider = localTraceProvider

  return localTraceProvider
}

export function getTracerProvider() {
  if (!tracerProvider) {
    tracerProvider = setupTracerProvider()
  }

  return tracerProvider
}