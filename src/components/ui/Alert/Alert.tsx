import { Alert as UIAlert, Icon as UIIcon } from '@faststore/ui'
import { useCallback } from 'react'
import type { ReactNode, MouseEvent } from 'react'
import type { AlertProps } from '@faststore/ui'

import FrameworkLink from 'src/components/common/Link'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import styles from './alert.module.scss'

export type Props = AlertProps & {
  /**
   * Icon component for additional customization
   */
  icon?: ReactNode
  /**
   * Add the possibility to make the component dismissible
   */
  dismissible?: boolean
  /**
   * The href and label used at the link
   */
  link?: {
    to: string
    text: string
  }
  onClose?: (event: MouseEvent<HTMLElement>) => void
}

function Alert({
  children,
  icon,
  dismissible,
  link,
  onClose,
  ...otherProps
}: Props) {
  const handleClose = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (event.defaultPrevented) {
        return
      }

      onClose?.(event)
    },
    [onClose]
  )

  return (
    <UIAlert
      data-fs-alert
      data-fs-alert-dismissible={dismissible}
      className={styles.fsAlert}
      {...otherProps}
    >
      {icon && <UIIcon component={icon} />}

      <p data-fs-alert-content>{children}</p>

      {link && (
        <FrameworkLink data-fs-alert-link href={link.to}>
          {link.text}
        </FrameworkLink>
      )}

      {dismissible && (
        <Button data-fs-alert-button aria-label="Close" onClick={handleClose}>
          <span>
            <Icon name="X" width={18} height={18} weight="bold" />
          </span>
        </Button>
      )}
    </UIAlert>
  )
}

export default Alert
