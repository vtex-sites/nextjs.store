import { useCallback, useState } from 'react'
import type { ReactNode, PropsWithChildren } from 'react'

import { Alert as UIAlert } from '@faststore/ui'
import { mark } from 'src/sdk/tests/mark'
import Icon from 'src/components/ui/Icon'

interface Props {
  icon: string
  /**
   * For CMS integration purposes, should be used to pass content through it
   * instead pass through children
   */
  content?: ReactNode
  link?: {
    to: string
    text: string
    target: string
  }
  dismissible: boolean
}
function Alert({
  icon,
  content,
  link,
  dismissible = false,
  children,
}: PropsWithChildren<Props>) {
  const [displayAlert, setDisplayAlert] = useState(true)

  const onAlertClose = useCallback(
    () => setDisplayAlert(false),
    [setDisplayAlert]
  )

  if (displayAlert === false) {
    return null
  }

  return (
    <UIAlert
      icon={<Icon name={icon} />}
      dismissible={dismissible}
      onClose={onAlertClose}
      link={link}
    >
      {content ?? children}
    </UIAlert>
  )
}

Alert.displayName = 'Alert'

export default mark(Alert)
