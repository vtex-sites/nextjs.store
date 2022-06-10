import { DropdownButton as UIDropdownButton } from '@faststore/ui'
import type { DropdownButtonProps } from '@faststore/ui'

import styles from './dropdown.module.scss'

function DropdownButton({
  children,
  testId = 'store-dropdown-button',
  ...otherProps
}: DropdownButtonProps) {
  return (
    <UIDropdownButton
      data-fs-dropdown-button
      className={styles.fsDropdownButton}
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </UIDropdownButton>
  )
}

export default DropdownButton
