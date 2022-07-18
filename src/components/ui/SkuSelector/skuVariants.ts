import type { NextRouter } from 'next/router'

import type { ProductDetailsFragment_ProductFragment } from '@generated/graphql'

export type SkuVariants =
  ProductDetailsFragment_ProductFragment['isVariantOf']['hasVariant']

export type SkuVariantsByName = Record<
  string,
  Array<{ alt: string; src: string; label: string; value: string }>
>

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
