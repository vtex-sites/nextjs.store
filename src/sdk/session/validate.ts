import { gql } from '@faststore/graphql-utils'
import {
  createSessionStore,
  optimistic,
  useSession as useSessionSDK,
} from '@faststore/sdk'
import type { Session } from '@faststore/sdk'

import storeConfig from '../../../store.config'
import { request } from '../graphql/request'
import type {
  ValidateSessionMutation,
  ValidateSessionMutationVariables,
} from '../../../@generated/graphql/index'

const store = createSessionStore<Session>({
  initialValue: {
    currency: {
      code: 'USD',
      symbol: '$',
    },
    country: 'USA',
    locale: storeConfig.locale,
    channel: storeConfig.channel,
    postalCode: null,
    person: null,
  },
})

export const mutation = gql`
  mutation ValidateSession($session: IStoreSession!, $search: String!) {
    validateSession(session: $session, search: $search) {
      locale
      channel
      country
      postalCode
      currency {
        code
        symbol
      }
      person {
        id
        email
        givenName
        familyName
      }
    }
  }
`

export const validateSession = async (session: Session) => {
  const data = await request<
    ValidateSessionMutation,
    ValidateSessionMutationVariables
  >(mutation, { session, search: window.location.search })

  return data.validateSession
}

optimistic(store, validateSession)

export const useSession = () => useSessionSDK(store)
