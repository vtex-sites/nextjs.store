import { Modal as UIModal } from '@faststore/ui'
import type { ModalProps as UIModalProps } from '@faststore/ui'
import type { ReactNode } from 'react'

import { useUI } from 'src/sdk/ui/Provider'
import { useFadeEffect } from 'src/sdk/ui/useFadeEffect'

import styles from './modal.module.scss'

export type ModalProps = Omit<UIModalProps, 'isOpen'> & {
  children: (fadeOut: () => void) => ReactNode | ReactNode
}

function Modal({ className, children, ...props }: ModalProps) {
  const { closeModal } = useUI()
  const { fade, fadeOut } = useFadeEffect()

  return (
    <UIModal
      onDismiss={fadeOut}
      onTransitionEnd={() => fade === 'out' && closeModal()}
      data-modal
      data-modal-state={fade}
      className={`${styles.fsModal} ${className}`}
      {...props}
      isOpen
    >
      {children?.(fadeOut) ?? children}
    </UIModal>
  )
}

export default Modal

// import { Modal as UIModal } from '@faststore/ui'
// import type { ModalProps as UIModalProps } from '@faststore/ui'

// import styles from './modal.module.scss'

// export type ModalProps = UIModalProps & {
//   state?: 'in' | 'out'
// }

// function Modal({ state, className, ...props }: ModalProps) {
//   return (
//     <UIModal
//       data-modal
//       data-modal-state={state}
//       className={`${styles.fsModal} ${className}`}
//       {...props}
//     />
//   )
// }

// export default Modal
