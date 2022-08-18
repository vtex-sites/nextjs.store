import type { IShippingItem } from '@faststore/api'
import { gql } from '@faststore/graphql-utils'

import type {
  ShippingSimulationQueryQuery as Query,
  ShippingSimulationQueryQueryVariables as Variables,
} from '@generated/graphql'

import { useLazyQuery } from '../graphql/useLazyQuery'

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

function useShippingQuery({ country, postalCode, items }: ShippingQueryData) {
  const [loadShippingSimulation, { data, error, isValidating: loading }] =
    useLazyQuery<Query, Variables>(query, {
      items,
      postalCode,
      country,
    })

  return {
    loadShippingSimulation,
    data,
    error,
    loading,
  }
}

export default useShippingQuery
