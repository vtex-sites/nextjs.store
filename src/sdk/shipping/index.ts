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
    }
  }
`

export type ShippingQueryData = {
  items: IShippingItem[]
  postalCode: string
  country: string
}

export const getShippingEstimate = async ({
  country,
  postalCode,
  items,
}: ShippingQueryData) => {
  const data = await request<Query, Variables>(query, {
    items,
    postalCode,
    country,
  })

  return data
}

export default getShippingEstimate
