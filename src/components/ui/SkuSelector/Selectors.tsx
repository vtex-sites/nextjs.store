import { useContext, createContext } from 'react'
import { useRouter } from 'next/router'

import SkuSelector from './SkuSelector'
import { navigateToSku } from './skuVariants'
import type { SkuVariantsByName } from './skuVariants'

interface Props {
  availableVariations: SkuVariantsByName
  slugsMap: Record<string, string>
  activeVariations: Record<string, string>
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

function Selectors({ slugsMap, availableVariations, activeVariations }: Props) {
  const router = useRouter()

  // 'Color' variants are singled-out here because they will always be rendered
  // as 'image' variants. And they're also the 'dominant' variants in our store.
  const { Color: colorOptions, ...otherSkuVariants } = availableVariations

  return (
    <section>
      <SelectorsStateContext.Provider value={activeVariations}>
        {colorOptions && (
          <SkuSelector
            skuPropertyName="Color"
            label="Color"
            variant="image"
            options={colorOptions}
            onChange={(e) => {
              const newVariationValue = e.currentTarget.value

              navigateToSku({
                router,
                slugsMap,
                selectorsState: activeVariations,
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
                  selectorsState: activeVariations,
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

export function useSelectorsState() {
  return useContext(SelectorsStateContext)
}

export default Selectors
