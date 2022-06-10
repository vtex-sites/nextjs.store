import { DropdownItem as UIDropdownItem } from '@faststore/ui'
import type { DropdownItemProps } from '@faststore/ui'

import styles from './dropdown.module.scss'

function DropdownItem({
  children,
  testId = 'store-dropdown-item',
  ...otherProps
}: DropdownItemProps) {
  return (
    <UIDropdownItem
      data-fs-dropdown-item
      className={styles.fsDropdownItem}
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </UIDropdownItem>
  )
}

export default DropdownItem
