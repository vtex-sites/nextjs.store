import type { Plugin, OnExecuteHookResult } from '@envelop/core'
import { isAsyncIterable } from '@envelop/core'
import { useOnResolve } from '@envelop/on-resolve'
import type { Attributes } from '@opentelemetry/api'
import { SpanKind } from '@opentelemetry/api'
import * as opentelemetry from '@opentelemetry/api'
import {
  BasicTracerProvider,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base'
import type { Path } from 'graphql/jsutils/Path'

// eslint-disable-next-line
export enum AttributeName {
  EXECUTION_ERROR = 'graphql.execute.error',
  EXECUTION_RESULT = 'graphql.execute.result',
  RESOLVER_EXCEPTION = 'graphql.resolver.exception',
  RESOLVER_FIELD_NAME = 'graphql.resolver.fieldName',
  RESOLVER_TYPE_NAME = 'graphql.resolver.typeName',
  RESOLVER_RESULT_TYPE = 'graphql.resolver.resultType',
  RESOLVER_ARGS = 'graphql.resolver.args',
  EXECUTION_OPERATION_NAME = 'graphql.execute.operationName',
  EXECUTION_OPERATION_DOCUMENT = 'graphql.execute.document',
  EXECUTION_VARIABLES = 'graphql.execute.variables',
}

const tracingSpanSymbol = Symbol('OPEN_TELEMETRY_GRAPHQL')

export type TracingOptions = {
  resolvers: boolean
  variables: boolean
  result: boolean
}

type PluginContext = {
  [tracingSpanSymbol]: opentelemetry.Span
}

function getResolverSpanKey(path: Path) {
  const nodes = []

  // If the first node (after reversed, it will be the last one) is an integer, that is, identifies a list,
  // we don't want to include it in the key. Note that this will only happen when analysing .prev paths in
  // a list of elements. We just want to remove the initial node that is a integer, not all of them.
  //
  // Nodes with keys 6bc73341b2a183fc::product::image::0::url would not be able to find
  // parents with key 6bc73341b2a183fc::product::image because of the "0" list index -
  // it would search for 6bc73341b2a183fc::product::image::0
  let currentPath: Path | undefined =
    nodes.length === 0 && Number.isInteger(path.key) ? path.prev : path

  while (currentPath) {
    nodes.push(currentPath.key)

    currentPath = currentPath.prev
  }

  return [...nodes].reverse().join('.')
}

export const useOpenTelemetry = (
  options: TracingOptions,
  tracingProvider?: BasicTracerProvider,
  spanKind: SpanKind = SpanKind.SERVER,
  spanAdditionalAttributes: Attributes = {},
  serviceName = 'graphql'
): Plugin<PluginContext> => {
  if (!tracingProvider) {
    tracingProvider = new BasicTracerProvider()
    tracingProvider.addSpanProcessor(
      new SimpleSpanProcessor(new ConsoleSpanExporter())
    )
    tracingProvider.register()
  }

  const tracer = tracingProvider.getTracer(serviceName)

  let resolverContextsByRootSpans: Record<
    string,
    Record<string, opentelemetry.Context>
  > = {}

  return {
    onPluginInit({ addPlugin }) {
      if (options.resolvers) {
        addPlugin(
          // eslint-disable-next-line
          useOnResolve(({ info, context, args }) => {
            if (
              context &&
              typeof context === 'object' &&
              context[tracingSpanSymbol]
            ) {
              tracer.getActiveSpanProcessor()
              const rootContextSpanId =
                context[tracingSpanSymbol].spanContext().spanId

              const { fieldName, returnType, parentType, path } = info

              const previousResolverSpanKey =
                path.prev && getResolverSpanKey(path.prev)

              let ctx: opentelemetry.Context | null = null

              if (
                previousResolverSpanKey &&
                resolverContextsByRootSpans[rootContextSpanId][
                  previousResolverSpanKey
                ]
              ) {
                ctx =
                  resolverContextsByRootSpans[rootContextSpanId][
                    previousResolverSpanKey
                  ]
              } else {
                ctx = opentelemetry.trace.setSpan(
                  opentelemetry.context.active(),
                  context[tracingSpanSymbol]
                )

                resolverContextsByRootSpans[rootContextSpanId] =
                  resolverContextsByRootSpans[rootContextSpanId] ?? {}
              }

              const resolverIndexInList = Number.isInteger(path.prev?.key)
                ? `[${path.prev?.key}]`
                : ''

              const resolverSpan = tracer.startSpan(
                `${parentType.toString()}.${fieldName}${resolverIndexInList}`,
                {
                  attributes: {
                    [AttributeName.RESOLVER_FIELD_NAME]: fieldName,
                    [AttributeName.RESOLVER_TYPE_NAME]: parentType.toString(),
                    [AttributeName.RESOLVER_RESULT_TYPE]: returnType.toString(),
                    [AttributeName.RESOLVER_ARGS]: JSON.stringify(args || {}),
                    'meta.span.path': getResolverSpanKey(path),
                  },
                },
                ctx
              )

              const resolverCtx = opentelemetry.trace.setSpan(ctx, resolverSpan)

              resolverContextsByRootSpans[rootContextSpanId][
                getResolverSpanKey(path)
              ] = resolverCtx

              return ({ result }) => {
                if (result instanceof Error) {
                  resolverSpan.recordException(result)
                }

                resolverSpan.end()
              }
            }

            return () => {}
          })
        )
      }
    },
    onExecute({ args, extendContext }) {
      const executionSpan = tracer.startSpan(
        `${args.operationName || 'Anonymous Operation'}`,
        {
          kind: spanKind,
          attributes: {
            ...spanAdditionalAttributes,
            [AttributeName.EXECUTION_OPERATION_NAME]:
              args.operationName ?? undefined,
            // [AttributeName.EXECUTION_OPERATION_DOCUMENT]: print(args.document),
            ...(options.variables
              ? {
                  [AttributeName.EXECUTION_VARIABLES]: JSON.stringify(
                    args.variableValues ?? {}
                  ),
                }
              : {}),
          },
        }
      )

      const resultCbs: OnExecuteHookResult<PluginContext> = {
        onExecuteDone({ result }) {
          if (isAsyncIterable(result)) {
            executionSpan.end()
            // eslint-disable-next-line no-console
            console.warn(
              `Plugin "newrelic" encountered a AsyncIterator which is not supported yet, so tracing data is not available for the operation.`
            )

            return
          }

          const rootContextSpanId = executionSpan.spanContext().spanId

          const { [rootContextSpanId]: _, ...rest } =
            resolverContextsByRootSpans

          resolverContextsByRootSpans = rest

          if (result.data && options.result) {
            executionSpan.setAttribute(
              AttributeName.EXECUTION_RESULT,
              JSON.stringify(result)
            )
          }

          if (result.errors && result.errors.length > 0) {
            executionSpan.recordException({
              name: AttributeName.EXECUTION_ERROR,
              message: JSON.stringify(result.errors),
            })
          }

          executionSpan.end()
        },
      }

      if (options.resolvers) {
        extendContext({
          [tracingSpanSymbol]: executionSpan,
        })
      }

      return resultCbs
    },
  }
}
