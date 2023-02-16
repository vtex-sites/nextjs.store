import { Label } from '@faststore/ui'
import { forwardRef } from 'react'
import type {
  FunctionComponent,
  HTMLAttributes,
  PropsWithChildren,
} from 'react'

import { useSkuSelectors } from './SkuSelectorsContext'
import { getSkuSlug } from './skuVariants'
import styles from './sku-selector.module.scss'

interface SkuOption {
  /**
   * Alternative text description of the image.
   */
  alt?: string
  /**
   * Image URL.
   */
  src?: string
  /**
   * Label to describe the option when selected.
   */
  label: string
  /**
   * Current value for this option.
   */
  value: string
  /**
   * Specifies that this option should be disabled.
   */
  disabled?: boolean
}

export interface SkuSelectorProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * ID of the current instance of the component.
   */
  id?: string
  /**
   * Specify which variant the component should handle.
   */
  variant: 'label' | 'image'
  /**
   * SKU options that should be rendered.
   */
  options: SkuOption[]
  /**
   * Name of the SKU property that this selector is relative to.
   */
  skuPropertyName?: string
  LinkComponent: FunctionComponent<PropsWithChildren<{ href: string }>>
  ImageComponent: FunctionComponent<{
    src: string
    alt?: string
  }>
}

const SkuSelector = forwardRef<HTMLDivElement, SkuSelectorProps>(
  function SkuSelector(
    {
      options,
      variant,
      skuPropertyName,
      testId,
      ImageComponent,
      LinkComponent,
      ...otherProps
    },
    ref
  ) {
    const { activeVariations, slugsMap, dominantProperty } = useSkuSelectors()
    const activeSelectorValue = activeVariations[skuPropertyName ?? '']

    return (
      <div
        ref={ref}
        data-fs-sku-selector
        data-testid={testId}
        className={styles.fsSkuSelector}
        data-fs-sku-selector-variant={variant}
        {...otherProps}
      >
        {skuPropertyName && (
          <Label data-fs-sku-selector-title>
            {skuPropertyName}: <strong>{activeSelectorValue}</strong>
          </Label>
        )}

        {options.map((option, index) => {
          const currentOptionName =
            skuPropertyName ?? option.label.split(':')[0]

          const currentItemHref = `/${getSkuSlug(
            slugsMap,
            { ...activeVariations, [currentOptionName]: option.value },
            dominantProperty
          )}/p`

          return (
            <LinkComponent key={String(index)} href={currentItemHref}>
              {variant === 'label' && <span>{option.value}</span>}
              {variant === 'image' && 'src' in option && (
                <ImageComponent
                  src={option.src ?? ''}
                  alt={option.alt ?? ''}
                  data-fs-sku-selector-option-image
                />
              )}
            </LinkComponent>
          )
        })}
      </div>
    )
  }
)

export default SkuSelector
