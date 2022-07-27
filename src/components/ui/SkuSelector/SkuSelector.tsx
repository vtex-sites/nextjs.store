import { Label, RadioGroup, RadioOption } from '@faststore/ui'
import type { ChangeEventHandler } from 'react'

import { Image } from 'src/components/ui/Image'

import { useSelectorsState } from './Selectors'

interface SkuProps {
  /**
   * Alternative text description of the image.
   */
  alt: string
  /**
   * Image URL.
   */
  src: string
  /**
   * Label to describe the image when selected.
   */
  label: string
  /**
   * Current value for this SKU.
   */
  value: string
  /**
   * Specifies that this option should be disabled.
   */
  disabled?: boolean
}

type Variant = 'color' | 'label' | 'image'

export interface SkuSelectorProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * Specify which variant the component should handle.
   */
  variant: Variant
  /**
   * SKU options that should be rendered.
   */
  options: SkuProps[]
  /**
   * Default SKU option.
   */
  defaultSku?: string
  /**
   * Section label for the SKU selector.
   */
  label?: string
  /**
   * Name of the property the SKU Selector is showing options for.
   * Notice that this name should match the property name as it is in the
   * store's catalog.
   */
  skuPropertyName: string
  /**
   * Function to be triggered when SKU option change.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>
}

function SkuSelector({
  label,
  variant,
  options,
  onChange,
  testId = 'store-sku-selector',
  skuPropertyName,
}: SkuSelectorProps) {
  const selectorsState = useSelectorsState()
  const selectedSku = selectorsState[skuPropertyName]

  return (
    <div data-store-sku-selector data-testid={testId} data-variant={variant}>
      {label && (
        <Label data-sku-selector-label>
          {label}: <strong>{selectedSku}</strong>
        </Label>
      )}
      <RadioGroup
        selectedValue={selectedSku}
        name={`sku-selector-${variant}`}
        onChange={(e) => {
          onChange?.(e)
        }}
      >
        {options.map((option, index) => {
          return (
            <RadioOption
              key={String(index)}
              label={option.label}
              value={option.value}
              disabled={option.disabled}
              checked={option.value === selectedSku}
            >
              {variant === 'label' && <span>{option.value}</span>}
              {variant === 'image' && 'src' in option && (
                <span>
                  <Image
                    data-sku-selector-image
                    src={option.src}
                    alt={option.alt}
                    width={20}
                    height={20}
                    loading="lazy"
                  />
                </span>
              )}
            </RadioOption>
          )
        })}
      </RadioGroup>
    </div>
  )
}

export default SkuSelector
