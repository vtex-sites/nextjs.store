import { Modal, ModalProps } from '@faststore/ui'

import { RegionalizationModalContent } from '.'

type x = ModalProps['children']

function RegionalizationModal() {
  return (
    <Modal>
      {({ fadeOut }) => <RegionalizationModalContent onClose={fadeOut} />}
    </Modal>
  )
}

export default RegionalizationModal
