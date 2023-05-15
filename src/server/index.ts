/* eslint-disable react-hooks/rules-of-hooks */
import type { FormatErrorHandler } from '@envelop/core'
import {
  envelop,
  useAsyncSchema,
  useExtendContext,
  useMaskedErrors,
} from '@envelop/core'
import { useGraphQlJit } from '@envelop/graphql-jit'
import { useParserCache } from '@envelop/parser-cache'
import { useValidationCache } from '@envelop/validation-cache'
import {
  getContextFactory,
  getSchema,
  getTypeDefs,
  isFastStoreError,
} from '@faststore/api'
import { GraphQLError } from 'graphql'
import { makeExecutableSchema, mergeSchemas } from '@graphql-tools/schema'
import { mergeTypeDefs } from '@graphql-tools/merge'
import type { Maybe, Options as APIOptions, CacheControl } from '@faststore/api'
// Import the required OpenTelemetry libraries and plugins
import {
  BasicTracerProvider,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base'
import { Resource } from '@opentelemetry/resources'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc'
import {
  LoggerProvider,
  SimpleLogRecordProcessor,
  ConsoleLogRecordExporter,
} from '@opentelemetry/sdk-logs'
import { OTLPLogsExporter } from '@opentelemetry/exporter-logs-otlp-grpc'

import { useOpenTelemetry } from './openTelemetry'
import persisted from '../../@generated/graphql/persisted.json'
import storeConfig from '../../store.config'

interface ExecuteOptions<V = Record<string, unknown>> {
  operationName: string
  variables: V
  query?: string | null
}

const honeycombCollectorOptions = {
  // url is optional and can be omitted - default is http://localhost:4317
  url: 'opentelemetry-collector-beta.vtex.systems',
}

const openSearchCollectorOptions = {
  // url is optional and can be omitted - default is http://localhost:4317
  url: 'developer-logs.opentelemetry-collector.vtex.systems:80',
}

// Create a new tracer provider
const tracerProvider = new BasicTracerProvider({
  resource: new Resource({
    'service.name': 'faststore-api',
    'service.version': '1.12.38',
    'service.name_and_version': 'faststore-api@1.12.38',
    platform: storeConfig.platform,
    [`${storeConfig.platform}.account`]: storeConfig.api.storeId,
    [`${storeConfig.platform}.workspace`]: storeConfig.api.workspace,
    [`${storeConfig.platform}.environment`]: storeConfig.api.environment,
  }),
})

const loggerProvider = new LoggerProvider({
  resource: new Resource({
    'service.name': 'faststore-api',
    'service.version': '1.12.38',
    'service.name_and_version': 'faststore-api@1.12.38',
    platform: storeConfig.platform,
    [`${storeConfig.platform}.account`]: storeConfig.api.storeId,
    [`${storeConfig.platform}.workspace`]: storeConfig.api.workspace,
    [`${storeConfig.platform}.environment`]: storeConfig.api.environment,
    'Attributes.search_index': 'faststore_beta_api',
  }),
})

// Create a new exporter
const honeycombExporter = new OTLPTraceExporter(honeycombCollectorOptions)
const openSearchExporter = new OTLPLogsExporter(openSearchCollectorOptions)

// Set up a span processor to export spans to Honeycomb
const honeyCombSpanProcessor = new SimpleSpanProcessor(honeycombExporter)
const openSearchLogProcessor = new SimpleLogRecordProcessor(openSearchExporter)

// Set up a span processor to export spans to Honeycomb
const consoleLogExporter = new ConsoleLogRecordExporter()
const consoleLogProcessor = new SimpleLogRecordProcessor(consoleLogExporter)

// Set up a console exporter for debugging purposes
// const consoleExporter = new ConsoleSpanExporter()
// const debugProcessor = new SimpleSpanProcessor(consoleExporter)

// Register the span processors with the tracer provider
tracerProvider.addSpanProcessor(honeyCombSpanProcessor)
// tracerProvider.addSpanProcessor(debugProcessor)

loggerProvider.addLogRecordProcessor(openSearchLogProcessor)
loggerProvider.addLogRecordProcessor(consoleLogProcessor)

// Register the tracer provider with the OpenTelemetry API
tracerProvider.register()

const persistedQueries = new Map(Object.entries(persisted))

// Creating type definitions
const typeDefs = `
  type ProductCluster {
    id: String
    name: String
  }

  extend type StoreProduct {
    clusterHighlights: [ProductCluster!]
  }
`

// Creating resolvers
const resolvers = {
  StoreProduct: {
    clusterHighlights: () => {
      throw new Error('This is my test error from OpenTelemetry')
    },
  },
}

const apiOptions: APIOptions = {
  platform: storeConfig.platform as APIOptions['platform'],
  account: storeConfig.api.storeId,
  environment: storeConfig.api.environment as APIOptions['environment'],
  hideUnavailableItems: storeConfig.api.hideUnavailableItems,
  channel: storeConfig.session.channel,
  locale: storeConfig.session.locale,
  flags: {
    enableOrderFormSync: true,
  },
}

export const apiSchema = getSchema(apiOptions)

const mergedTypeDefs = mergeTypeDefs([getTypeDefs(), typeDefs])

const getMergedSchemas = async () =>
  mergeSchemas({
    schemas: [
      await apiSchema,
      makeExecutableSchema({
        resolvers,
        typeDefs: mergedTypeDefs,
      }),
    ],
  })

const apiContextFactory = getContextFactory(apiOptions)

const formatError: FormatErrorHandler = (err) => {
  if (err instanceof GraphQLError && isFastStoreError(err.originalError)) {
    return err
  }

  console.error(err)

  return new GraphQLError('Sorry, something went wrong.')
}

const getEnvelop = async () =>
  envelop({
    plugins: [
      useAsyncSchema(getMergedSchemas()),
      useExtendContext(apiContextFactory),
      useOpenTelemetry(
        {
          resolvers: true, // Tracks resolvers calls, and tracks resolvers thrown errors
          variables: false, // Includes the operation variables values as part of the metadata collected
          result: false, // Includes execution result object as part of the metadata collected
        },

        // The @opentelemetry/sdk-trace-base was renamed from @opentelemetry/tracing but the
        // envelop plugin doesn't support this change yet. This causes the class type to be incompatible,
        // even if they are the same. https://github.com/n1ru4l/envelop/issues/1610
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tracerProvider as any,
        loggerProvider,
        undefined,
        undefined,
        'faststore-api'
      ),
      useMaskedErrors({ formatError }),
      useGraphQlJit(),
      useValidationCache(),
      useParserCache(),
    ],
  })

const envelopPromise = getEnvelop()

export const execute = async <V extends Maybe<{ [key: string]: unknown }>, D>(
  options: ExecuteOptions<V>,
  envelopContext = { headers: {} }
): Promise<{
  data: D
  errors: unknown[]
  extensions: { cacheControl?: CacheControl }
}> => {
  const { operationName, variables, query: maybeQuery } = options
  const query = maybeQuery ?? persistedQueries.get(operationName)

  if (query == null) {
    throw new Error(`No query found for operationName: ${operationName}`)
  }

  const enveloped = await envelopPromise
  const {
    parse,
    contextFactory,
    execute: run,
    schema,
  } = enveloped(envelopContext)

  const contextValue = await contextFactory(envelopContext)

  const { data, errors } = (await run({
    schema,
    document: parse(query),
    variableValues: variables,
    contextValue,
    operationName,
  })) as { data: D; errors: unknown[] }

  return {
    data,
    errors,
    extensions: { cacheControl: contextValue.cacheControl },
  }
}
