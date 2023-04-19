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
import { print } from 'graphql'
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

  let currentPath: Path | undefined = path

  while (currentPath) {
    nodes.push(currentPath.key)

    currentPath = currentPath.prev
  }

  return nodes.reverse().join('::')
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

  return {
    onPluginInit({ addPlugin }) {
      if (options.resolvers) {
        const parentTypeMap = new Map<string, opentelemetry.Context>()

        addPlugin(
          // eslint-disable-next-line
          useOnResolve(({ info, context, args }) => {
            if (
              context &&
              typeof context === 'object' &&
              context[tracingSpanSymbol]
            ) {
              tracer.getActiveSpanProcessor()

              const { fieldName, returnType, parentType, path } = info

              const ctx =
                path.prev && parentTypeMap.has(getResolverSpanKey(path.prev))
                  ? parentTypeMap.get(getResolverSpanKey(path.prev))
                  : opentelemetry.trace.setSpan(
                      opentelemetry.context.active(),
                      context[tracingSpanSymbol]
                    )

              const resolverSpan = tracer.startSpan(
                `${parentType.toString()}.${fieldName}`,
                {
                  attributes: {
                    [AttributeName.RESOLVER_FIELD_NAME]: fieldName,
                    [AttributeName.RESOLVER_TYPE_NAME]: parentType.toString(),
                    [AttributeName.RESOLVER_RESULT_TYPE]: returnType.toString(),
                    [AttributeName.RESOLVER_ARGS]: JSON.stringify(args || {}),
                  },
                },
                ctx
              )

              const resolverCtx = opentelemetry.trace.setSpan(
                opentelemetry.context.active(),
                resolverSpan
              )

              parentTypeMap.set(getResolverSpanKey(path), resolverCtx)

              return ({ result }) => {
                if (result instanceof Error) {
                  resolverSpan.recordException({
                    name: AttributeName.RESOLVER_EXCEPTION,
                    message: JSON.stringify(result),
                  })
                } else {
                  resolverSpan.end()
                }
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
            [AttributeName.EXECUTION_OPERATION_DOCUMENT]: print(args.document),
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
