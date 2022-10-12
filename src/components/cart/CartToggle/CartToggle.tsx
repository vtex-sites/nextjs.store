import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import { useCartToggleButton } from 'src/sdk/cart/useCartToggleButton'

function CartToggle() {
  const { 'data-items': totalItems, ...btnProps } = useCartToggleButton()

  return (
    <Button
      data-fs-button-cart
      counter={totalItems}
      aria-label={`Cart with ${totalItems} items`}
      icon={<Icon name="ShoppingCart" width={32} height={32} />}
      {...btnProps}
    />
  )
}

export default CartToggle
