import { useCallback, useState } from 'react'
import { gql } from '@faststore/graphql-utils'

import type {
  SubscribeToNewsletterMutation,
  SubscribeToNewsletterMutationVariables,
} from '../../../@generated/graphql/index'
import { request } from '../graphql/request'

type MasterDataResponse = {
  id: string
}

export const mutation = gql`
  mutation SubscribeToNewsletter($data: IPersonNewsletter!) {
    subscribeToNewsletter(data: $data) {
      id
    }
  }
`
const subscribeToNewsletter = async (data: { name: string; email: string }) => {
  const response = await request<
    SubscribeToNewsletterMutation,
    SubscribeToNewsletterMutationVariables
  >(mutation, { data })

  return response.subscribeToNewsletter
}

export const useNewsletter = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<MasterDataResponse | null>(null)
  const [error, setError] = useState(false)

  const addUser = useCallback(
    (user: { name: string; email: string }) => {
      setError(false)
      setData(null)
      setLoading(true)

      return subscribeToNewsletter(user)
        .then((response) => {
          setData(response as MasterDataResponse)
        })
        .catch(() => {
          setError(true)
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [setError, setData, setLoading]
  )

  const reset = useCallback(() => {
    setData(null)
    setError(false)
    setLoading(false)
  }, [])

  return {
    error,
    addUser,
    loading,
    data,
    reset,
  }
}
