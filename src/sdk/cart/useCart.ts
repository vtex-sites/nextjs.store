import { useStore } from '@faststore/sdk'
import { useMemo } from 'react'

import { cartStore } from './store'
import type { CartItem } from './store'

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
