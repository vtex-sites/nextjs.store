import { useContext, createContext } from 'react'
import { useRouter } from 'next/router'

import SkuSelector from './SkuSelector'
import { useSkuVariants } from './useSkuVariants'
import type { SkuVariants } from './useSkuVariants'
import {
  getAvailableVariationsForSelectedColor,
  getSelectedVariations,
  navigateToSku,
} from './skuVariants'

interface Props {
  options: SkuVariants
  productId: string
}

/**
 * Name of the property that's considered **dominant**. Which means that all
 * other varying properties will be filtered according to the current value
 * of this property.
 *
 * Ex: If `Red` is the current value for the 'Color' variation, we'll only
 * render possible values for 'Size' that are available in `Red`.
 */
const DOMINANT_SKU_SELECTOR_PROPERTY = 'Color'

const SelectorsStateContext = createContext<Record<string, string>>({})

function Selectors({ options, productId }: Props) {
  const router = useRouter()
  const selectedVariations = getSelectedVariations(productId, options)

  const { optionsByType, slugsMap, variationsByMainVariationValues } =
    useSkuVariants(options, DOMINANT_SKU_SELECTOR_PROPERTY)

  const filteredOptionsByCurrentColor = getAvailableVariationsForSelectedColor(
    selectedVariations.Color,
    optionsByType,
    variationsByMainVariationValues
  )

  // 'Color' variants are singled-out here because they will always be rendered
  // as 'image' variants. And they're also the 'dominant' variants in our store.
  const { Color: colorVariants, ...otherSkuVariants } =
    filteredOptionsByCurrentColor

  return (
    <section>
      <SelectorsStateContext.Provider value={selectedVariations}>
        {colorVariants && (
          <SkuSelector
            skuPropertyName="Color"
            label="Color"
            variant="image"
            options={colorVariants}
            onChange={(e) => {
              const newVariationValue = e.currentTarget.value

              navigateToSku({
                router,
                slugsMap,
                selectedVariations,
                updatedVariationName: 'Color',
                updatedVariationValue: newVariationValue,
                dominantSku: DOMINANT_SKU_SELECTOR_PROPERTY,
              })
            }}
          />
        )}
        {otherSkuVariants &&
          Object.keys(otherSkuVariants).map((skuVariant) => (
            <SkuSelector
              label={skuVariant}
              skuPropertyName={skuVariant}
              key={skuVariant}
              variant="label"
              options={otherSkuVariants[skuVariant]}
              onChange={(e) => {
                const newVariationValue = e.currentTarget.value

                navigateToSku({
                  router,
                  slugsMap,
                  selectedVariations,
                  updatedVariationName: skuVariant,
                  updatedVariationValue: newVariationValue,
                  dominantSku: DOMINANT_SKU_SELECTOR_PROPERTY,
                })
              }}
            />
          ))}
      </SelectorsStateContext.Provider>
    </section>
  )
}

export function useSelectorState() {
  return useContext(SelectorsStateContext)
}

export default Selectors
