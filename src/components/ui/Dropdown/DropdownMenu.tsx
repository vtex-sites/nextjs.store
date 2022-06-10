import { DropdownMenu as UIDropdownMenu } from '@faststore/ui'
import type { DropdownMenuProps } from '@faststore/ui'

import styles from './dropdown.module.scss'

function DropdownMenu({
  children,
  testId = 'store-dropdown-menu',
  ...otherProps
}: DropdownMenuProps) {
  return (
    <UIDropdownMenu
      data-fs-dropdown-menu
      className={styles.fsDropdownMenu}
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </UIDropdownMenu>
  )
}

export default DropdownMenu
