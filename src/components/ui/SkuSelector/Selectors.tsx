import { useContext, createContext } from 'react'
import { useRouter } from 'next/router'
import type { NextRouter } from 'next/router'

import type { ProductDetailsFragment_ProductFragment } from '@generated/graphql'

import SkuSelector from './SkuSelector'
import { useSKUVariations } from './useSKUVariations'

type SKUOptionsByType = Record<
  string,
  Array<
    | {
        label: string
        value: string
      }
    | { alt: string; src: string; label: string; value: string }
  >
>

interface Props {
  options: ProductDetailsFragment_ProductFragment['isVariantOf']['hasVariant']
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

function getSkuSlug(
  slugsMap: Record<string, string>,
  selectedVariations: Record<string, string>,
  dominantVariation: string
) {
  let slugsMapKey = ''

  for (const key in selectedVariations) {
    if (key in selectedVariations) {
      const variationValue = selectedVariations[key]

      slugsMapKey += `${key}-${variationValue}-`
    }
  }

  // Remove trailing '-'
  slugsMapKey = slugsMapKey.slice(0, slugsMapKey.length - 1)

  const variantExists = slugsMapKey in slugsMap

  if (!variantExists) {
    const possibleVariants = Object.keys(slugsMap)
    const firstVariationForDominantValue = possibleVariants.find((slug) =>
      slug.includes(
        `${dominantVariation}-${selectedVariations[dominantVariation]}`
      )
    )

    // This is an inconsistent state
    if (!firstVariationForDominantValue) {
      return slugsMap[possibleVariants[0]]
    }

    return slugsMap[firstVariationForDominantValue]
  }

  return slugsMap[slugsMapKey]
}

function getSelectedVariations(
  productId: string,
  variants: ProductDetailsFragment_ProductFragment['isVariantOf']['hasVariant']
) {
  const currentVariation = variants.find(
    (variant) => variant.productID === productId
  )

  if (!currentVariation) {
    throw new Error('Invalid SKU variations state reached.')
  }

  const selectedVariations: Record<string, string> = {}

  currentVariation.additionalProperty.forEach((property) => {
    selectedVariations[property.name] = property.value
  })

  return selectedVariations
}

function getAvailableVariationsForSelectedColor(
  selectedColor: string,
  options: SKUOptionsByType,
  variationsByMainVariationValues: Record<string, Record<string, string[]>>
): SKUOptionsByType {
  const filteredOptions: SKUOptionsByType = {}

  const { Color, ...otherProperties } = options

  for (const propertyName in otherProperties) {
    if (Object.prototype.hasOwnProperty.call(otherProperties, propertyName)) {
      filteredOptions[propertyName] = otherProperties[propertyName].filter(
        (formattedProperty) =>
          variationsByMainVariationValues[selectedColor][propertyName].includes(
            formattedProperty.value
          )
      )
      otherProperties[propertyName]
    }
  }

  return { Color, ...filteredOptions }
}

function navigateToSku({
  selectedVariations,
  updatedVariationName,
  updatedVariationValue,
  slugsMap,
  router,
  dominantSku,
}: {
  selectedVariations: Record<string, string>
  updatedVariationName: string
  updatedVariationValue: string
  slugsMap: Record<string, string>
  router: NextRouter
  dominantSku: string
}) {
  const whereTo = `/${getSkuSlug(
    slugsMap,
    {
      ...selectedVariations,
      [updatedVariationName]: updatedVariationValue,
    },
    dominantSku
  )}/p`

  if (whereTo === window.location.pathname) {
    return
  }

  router.push(whereTo)
}

const SelectorsStateContext = createContext<Record<string, string>>({})

function Selectors({ options, productId }: Props) {
  const router = useRouter()
  const selectedVariations = getSelectedVariations(productId, options)

  const { optionsByType, slugsMap, variationsByMainVariationValues } =
    useSKUVariations(options, DOMINANT_SKU_SELECTOR_PROPERTY)

  const filteredOptionsByCurrentColor = getAvailableVariationsForSelectedColor(
    selectedVariations.Color,
    optionsByType,
    variationsByMainVariationValues
  )

  // 'Color' variants are singled-out here because they will always be rendered
  // as 'image' variants. And they're also the 'dominant' variants in our store.
  const { Color: colorVariants, ...otherSKUVariants } =
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
        {otherSKUVariants &&
          Object.keys(otherSKUVariants).map((skuVariant) => (
            <SkuSelector
              label={skuVariant}
              skuPropertyName={skuVariant}
              key={skuVariant}
              variant="label"
              options={otherSKUVariants[skuVariant]}
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
