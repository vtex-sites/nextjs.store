import { useCart } from './index'
import * as storeConfig from '../../../store.config'

const { checkoutUrl } = storeConfig

export const useCheckoutButton = () => {
  const { id } = useCart()
  const isValidating = false // TODO make it work

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!isValidating && id) {
      window.location.href = `${checkoutUrl}?orderFormId=${id}`
    }
  }

  return {
    onClick,
    disabled: isValidating,
    'data-testid': 'checkout-button',
  }
}
