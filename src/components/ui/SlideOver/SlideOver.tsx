import { SlideOver as SlideOverUI } from '@faststore/ui'
import type { SlideOverProps as SlideOverUIProps } from '@faststore/ui'

import styles from './slide-over.module.scss'

function SlideOver({ className, children, ...otherProps }: SlideOverUIProps) {
  return (
    <SlideOverUI
      className={`${styles.fsSlideOver} ${className}`}
      {...otherProps}
    >
      {children}
    </SlideOverUI>
  )
}

export default SlideOver
