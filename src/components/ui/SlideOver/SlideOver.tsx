import { Modal as UIModal } from '@faststore/ui'
import type { HTMLAttributes, ReactNode } from 'react'

import styles from './slide-over.module.scss'

type Direction = 'leftSide' | 'rightSide'
type WidthSize = 'full' | 'partial'

interface SlideOverProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  direction: Direction
  size: WidthSize
  children: ReactNode
  fade: 'in' | 'out'
  /**
   * This function is called whenever the user clicks outside
   * the modal content
   */
  onDismiss?: () => void
}

function SlideOver({
  isOpen,
  direction = 'leftSide',
  size = 'full',
  fade = 'out',
  children,
  className,
  ...otherProps
}: SlideOverProps) {
  return (
    <UIModal
      className={`${styles.fsSlideOver} ${className}`}
      isOpen={isOpen}
      data-fs-slide-over
      data-fs-slide-over-direction={direction}
      data-fs-slide-over-size={size}
      data-fs-slide-over-state={fade}
      {...otherProps}
    >
      {children}
    </UIModal>
  )
}

export default SlideOver
