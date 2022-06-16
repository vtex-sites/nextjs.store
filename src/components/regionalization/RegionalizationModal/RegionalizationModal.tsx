import Modal from 'src/components/ui/Modal'

import { RegionalizationModalContent } from '.'

function RegionModal() {
  return (
    <Modal>
      {({ fadeOut }) => <RegionalizationModalContent onClose={fadeOut} />}
    </Modal>
  )
}

export default RegionModal
