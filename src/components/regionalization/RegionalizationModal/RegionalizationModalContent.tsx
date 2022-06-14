import RegionalizationInput from 'src/components/regionalization/RegionalizationInput'
import { ButtonIcon } from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Link from 'src/components/ui/Link'

import styles from './regionalization-modal-content.module.scss'

export type RegionModalContentProps = {
  onClose?: () => void
}

function RegionModalContent({ onClose }: RegionModalContentProps) {
  return (
    <div
      data-regionalization-modal-content
      className={styles.fsRegionalizationModalContent}
    >
      <header data-regionalization-modal-header>
        <ButtonIcon
          onClick={() => onClose?.()}
          data-fs-regionalization-modal-button
          aria-label="Close Regionalization Modal"
          data-testid="regionalization-modal-button-close"
          icon={<Icon name="X" width={30} height={30} />}
        />
        <p data-regionalization-modal-title>Set your location</p>
        <p data-regionalization-modal-description>
          Prices, offers and availability may vary according to your location.
        </p>
      </header>
      <div data-fs-regionalization-modal-body>
        {/* TODO: Remove this div when PostalCodeInput be styled */}
        <div data-regionalization-modal-input>
          <RegionalizationInput closeModal={() => onClose?.()} />
        </div>
        <Link href="/">
          <span data-regionalization-modal-link>
            {"Don't know my Postal Code"}
          </span>
          <Icon name="ArrowSquareOut" width={18} height={18} />
        </Link>
      </div>
    </div>
  )
}

export default RegionModalContent
