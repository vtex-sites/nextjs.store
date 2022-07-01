import { gql } from '@faststore/graphql-utils'
import { createSessionStore, useStore } from '@faststore/sdk'
import type { Session } from '@faststore/sdk'

import storeConfig from 'store.config'

import { request } from '../graphql/request'
import type {
  ValidateSessionMutation,
  ValidateSessionMutationVariables,
} from '../../../@generated/graphql/index'

export const validateSession = async (session: Session) => {
  const data = await request<
    ValidateSessionMutation,
    ValidateSessionMutationVariables
  >(
    gql`
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
    `,
    { session, search: window.location.search }
  )

  return data.validateSession
}

export const sessionStore = createSessionStore(
  {
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
  validateSession
)

export const useSession = () => useStore(sessionStore)
