import { gql } from '@faststore/graphql-utils'
import { createCartStore, useStore } from '@faststore/sdk'
import { useMemo } from 'react'
import type { Cart as SDKCart, CartItem as SDKCartItem } from '@faststore/sdk'

import type {
  CartItemFragment,
  CartMessageFragment,
  IStoreOffer,
  ValidateCartMutationMutation,
  ValidateCartMutationMutationVariables,
} from '@generated/graphql'

import { request } from '../graphql/request'

export interface CartItem extends SDKCartItem, CartItemFragment {}

export interface Cart extends SDKCart<CartItem> {
  messages?: CartMessageFragment[]
}

const getItemId = (item: Pick<CartItem, 'itemOffered' | 'seller' | 'price'>) =>
  [
    item.itemOffered.sku,
    item.seller.identifier,
    item.price,
    item.itemOffered.additionalProperty
      ?.map(({ propertyID }) => propertyID)
      .join('-'),
  ]
    .filter(Boolean)
    .join('::')

const validateCart = async (c: Cart): Promise<Cart | null> => {
  const { validateCart: validated = null } = await request<
    ValidateCartMutationMutation,
    ValidateCartMutationMutationVariables
  >(
    gql`
      mutation ValidateCartMutation($cart: IStoreCart!) {
        validateCart(cart: $cart) {
          order {
            orderNumber
            acceptedOffer {
              ...CartItem
            }
          }
          messages {
            ...CartMessage
          }
        }
      }

      fragment CartMessage on StoreCartMessage {
        text
        status
      }

      fragment CartItem on StoreOffer {
        seller {
          identifier
        }
        quantity
        price
        listPrice
        itemOffered {
          sku
          name
          image {
            url
            alternateName
          }
          brand {
            name
          }
          isVariantOf {
            productGroupID
            name
          }
          gtin
          additionalProperty {
            propertyID
            name
            value
            valueReference
          }
        }
      }
    `,
    {
      cart: {
        order: {
          orderNumber: c.id,
          acceptedOffer: c.items.map(
            ({
              price,
              listPrice,
              seller,
              quantity,
              itemOffered,
            }): IStoreOffer => ({
              price,
              listPrice,
              seller,
              quantity,
              itemOffered: {
                sku: itemOffered.sku,
                image: itemOffered.image,
                name: itemOffered.name,
                additionalProperty: itemOffered.additionalProperty,
              },
            })
          ),
        },
      },
    }
  )

  return (
    validated && {
      id: validated.order.orderNumber,
      items: validated.order.acceptedOffer.map((item) => ({
        ...item,
        id: getItemId(item),
      })),
      messages: validated.messages,
    }
  )
}

const store = createCartStore<Cart>(
  {
    id: '',
    items: [],
    messages: [],
  },
  validateCart
)

export const cartStore = {
  ...store,
  addItem: (item: Omit<CartItem, 'id'>) => {
    const cartItem = {
      ...item,
      id: getItemId(item),
    }

    store.addItem(cartItem)
  },
}

const isGift = (item: CartItem) => item.price === 0

export const useCart = () => {
  const cart = useStore(cartStore)

  return useMemo(
    () => ({
      ...cart,
      gifts: cart.items.filter((item) => isGift(item)),
      items: cart.items.filter((item) => !isGift(item)),
      totalUniqueItems: cart.items.length,
      totalItems: cart.items.reduce(
        (acc, curr) => acc + (isGift(curr) ? 0 : curr.quantity),
        0
      ),
      total: cart.items.reduce(
        (acc, curr) => acc + curr.price * curr.quantity,
        0
      ),
      subTotal: cart.items.reduce(
        (acc, curr) => acc + curr.listPrice * curr.quantity,
        0
      ),
    }),
    [cart]
  )
}
