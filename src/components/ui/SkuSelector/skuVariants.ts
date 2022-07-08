import type { NextRouter } from 'next/router'

import type { SkuOptionsByName, SkuVariants } from './useSkuVariants'

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
  options: SkuOptionsByName,
  variationsByMainVariationValues: Record<string, Record<string, string[]>>
): SkuOptionsByName {
  const filteredOptions: SkuOptionsByName = {}

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

export function navigateToSku({
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
