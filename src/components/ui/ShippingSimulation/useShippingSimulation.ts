import type { ChangeEvent } from 'react'
import { useCallback, useEffect, useReducer } from 'react'

import type { ShippingSimulationQueryQuery } from '@generated/graphql'
import { useSession } from 'src/sdk/session'
import { getFriendlyEstimate, getShippingSimulation } from 'src/sdk/shipping'

import type { ShippingItem } from './ShippingSimulation'

type InputProps = {
  postalCode?: string
  displayClearButton?: boolean
  errorMessage?: string
}

type ShippingOptionProps = {
  carrier: string
  estimate: string
  price?: string
}

type ShippingSimulationProps = {
  location?: string
  options?: ShippingOptionProps[]
}

type State = {
  input: InputProps
  shippingSimulation: ShippingSimulationProps
}

type Action =
  | {
      type: 'update'
      payload: State
    }
  | {
      type: 'onInput'
      payload: InputProps
    }
  | {
      type: 'onError'
      payload: Partial<InputProps>
    }
  | {
      type: 'clear'
    }

const createEmptySimulation = () => ({
  input: {
    postalCode: '',
    displayClearButton: false,
    errorMessage: '',
  },
  shippingSimulation: {
    location: '',
    options: [],
  },
})

const reducer = (state: State, action: Action) => {
  const { type } = action

  switch (type) {
    case 'clear': {
      return createEmptySimulation()
    }

    case 'update': {
      const { payload } = action

      return {
        input: {
          ...state.input,
          ...payload.input,
        },
        shippingSimulation: {
          ...state.shippingSimulation,
          ...payload.shippingSimulation,
        },
      }
    }

    case 'onInput': {
      const { payload } = action

      return {
        ...state,
        input: {
          ...payload,
        },
      }
    }

    case 'onError': {
      const { payload } = action

      return {
        ...state,
        input: {
          ...state.input,
          ...payload,
        },
      }
    }

    default:
      throw new Error(`Action ${type} not implemented`)
  }
}

function getShippingInformation(
  shipping: ShippingSimulationQueryQuery['shipping']
): [string, ShippingOptionProps[]] {
  const location =
    [shipping?.address?.neighborhood, shipping?.address?.city]
      .filter(Boolean)
      .join(' / ') ?? ''

  const options: ShippingOptionProps[] =
    shipping?.logisticsInfo?.[0]?.slas?.map((sla) => ({
      carrier: sla?.name ?? '',
      estimate: sla?.shippingEstimate
        ? getFriendlyEstimate(sla.shippingEstimate)
        : '',
      price: String(sla?.price) ?? '',
    })) ?? []

  return [location, options]
}

export const useShippingSimulation = (shippingItem: ShippingItem) => {
  const { postalCode: sessionPostalCode, country } = useSession()
  const [{ input, shippingSimulation }, dispatch] = useReducer(
    reducer,
    null,
    createEmptySimulation
  )

  const { postalCode: shippingPostalCode } = input

  useEffect(() => {
    if (!sessionPostalCode || shippingPostalCode) {
      return
    }

    // Use sessionPostalCode if there is no shippingPostalCode
    async function fetchShipping() {
      const shipping = await getShippingSimulation({
        country,
        postalCode: sessionPostalCode ?? '',
        items: [shippingItem],
      })

      const [location, options] = getShippingInformation(shipping)

      dispatch({
        type: 'update',
        payload: {
          input: {
            postalCode: sessionPostalCode ?? '',
            displayClearButton: true,
            errorMessage: '',
          },
          shippingSimulation: {
            location,
            options,
          },
        },
      })
    }

    fetchShipping()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionPostalCode])

  const handleSubmit = useCallback(async () => {
    try {
      const shipping = await getShippingSimulation({
        country,
        postalCode: shippingPostalCode ?? '',
        items: [shippingItem],
      })

      const [location, options] = getShippingInformation(shipping)

      dispatch({
        type: 'update',
        payload: {
          input: {
            displayClearButton: true,
            errorMessage: '',
          },
          shippingSimulation: {
            location,
            options,
          },
        },
      })
    } catch (error) {
      dispatch({
        type: 'onError',
        payload: {
          displayClearButton: true,
          errorMessage: 'You entered an invalid Postal Code',
        },
      })
    }
  }, [shippingPostalCode])

  const handleOnInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.currentTarget.value

    if (currentValue) {
      dispatch({
        type: 'onInput',
        payload: {
          postalCode: currentValue,
          displayClearButton: false,
          errorMessage: '',
        },
      })
    } else {
      dispatch({
        type: 'clear',
      })
    }
  }, [])

  return {
    input,
    shippingSimulation,
    dispatch,
    handleSubmit,
    handleOnInput,
  }
}
