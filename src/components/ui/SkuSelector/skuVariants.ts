import type { NextRouter } from 'next/router'

import type { SkuVariantsByName, SkuVariants } from './useSkuVariants'

export function getSkuSlug(
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

    return slugsMap[firstVariationForDominantValue ?? possibleVariants[0]]
  }

  return slugsMap[slugsMapKey]
}

export function getSelectedVariations(
  productId: string,
  variants: SkuVariants
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

export function getAvailableVariationsForSelectedColor(
  selectedColor: string,
  options: SkuVariantsByName,
  variantsByDominantValue: Record<string, Record<string, string[]>>
): SkuVariantsByName {
  const filteredOptions: SkuVariantsByName = {}

  const { Color, ...otherProperties } = options

  for (const propertyName in otherProperties) {
    if (Object.prototype.hasOwnProperty.call(otherProperties, propertyName)) {
      filteredOptions[propertyName] = otherProperties[propertyName].filter(
        (formattedProperty) =>
          variantsByDominantValue[selectedColor][propertyName].includes(
            formattedProperty.value
          )
      )
      otherProperties[propertyName]
    }
  }

  return { Color, ...filteredOptions }
}

export function navigateToSku({
  router,
  slugsMap,
  dominantSku,
  selectorsState,
  updatedVariationName,
  updatedVariationValue,
}: {
  router: NextRouter
  dominantSku: string
  slugsMap: Record<string, string>
  selectorsState: Record<string, string>
  updatedVariationName: string
  updatedVariationValue: string
}) {
  const whereTo = `/${getSkuSlug(
    slugsMap,
    {
      ...selectorsState,
      [updatedVariationName]: updatedVariationValue,
    },
    dominantSku
  )}/p`

  if (whereTo === window.location.pathname) {
    return
  }

  router.push(whereTo)
}
