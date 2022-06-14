import Modal from 'src/components/ui/Modal'

import { RegionalizationModalContent } from '.'

function RegionModal() {
  return (
    <Modal>
      {(fadeOut) => <RegionalizationModalContent onClose={fadeOut} />}
    </Modal>
  )
}

export default RegionModal

// import Modal from 'src/components/ui/Modal'
// import { useUI } from 'src/sdk/ui/Provider'
// import { useFadeEffect } from 'src/sdk/ui/useFadeEffect'

// import { RegionalizationModalContent } from '.'

// function RegionModal() {
//   const { closeModal } = useUI()
//   const { fade, fadeOut } = useFadeEffect()

//   return (
//     <Modal
//       isOpen
//       data-modal-state={fade}
//       onDismiss={fadeOut}
//       onTransitionEnd={() => fade === 'out' && closeModal()}
//     >
//       <RegionalizationModalContent onClose={fadeOut} />
//     </Modal>
//   )
// }

// export default RegionModal
