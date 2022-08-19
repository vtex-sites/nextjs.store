import type { IShippingItem } from '@faststore/api'
import { gql } from '@faststore/graphql-utils'

import type {
  ShippingSimulationQueryQuery as Query,
  ShippingSimulationQueryQueryVariables as Variables,
} from '@generated/graphql'

import { request } from '../graphql/request'

const query = gql`
  query ShippingSimulationQuery(
    $postalCode: String!
    $country: String!
    $items: [IShippingItem!]!
  ) {
    shipping(items: $items, postalCode: $postalCode, country: $country) {
      logisticsInfo {
        itemIndex
        slas {
          id
          name
          friendlyName
          price
          shippingEstimate
          shippingEstimateDate
        }
      }
      address {
        city
        state
        street
        number
        neighborhood
      }
    }
  }
`

export type ShippingQueryData = {
  items: IShippingItem[]
  postalCode: string
  country: string
}

export const getShippingSimulation = async ({
  items,
  postalCode,
  country,
}: ShippingQueryData) => {
  const data = await request<Query, Variables>(query, {
    items,
    postalCode,
    country,
  })

  return data.shipping
}

type Unit = 'bd' | 'd' | 'h' | 'm'
const units = ['bd', 'd', 'h', 'm'] as const
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isUnit = (x: any): x is Unit => units.includes(x)

const friendlyEstimates: Record<Unit, Record<string, string>> = {
  bd: {
    0: 'Today',
    1: 'In 1 business day',
    other: `Up to # business days`,
  },
  d: {
    0: 'Today',
    1: 'In 1 day',
    other: 'Up to # days',
  },
  h: {
    0: 'Now',
    1: 'In 1 hour',
    other: 'Up to # hours',
  },
  m: {
    0: 'Now',
    1: 'In 1 minute',
    other: 'Up to # minutes',
  },
}

export const getFriendlyEstimate = (estimate: string): string => {
  const [amount, unit] = [estimate.split(/\D+/)[0], estimate.split(/[0-9]+/)[1]]

  const isAmountNumber = amount !== '' && !Number.isNaN(Number(amount))
  const isUnitValid = isUnit(unit)

  if (!isAmountNumber || !isUnitValid) {
    return ''
  }

  const amountKey = Number(amount) < 2 ? Number(amount) : 'other'

  return friendlyEstimates[unit][amountKey].replace('#', amount)
}

export default getShippingSimulation
