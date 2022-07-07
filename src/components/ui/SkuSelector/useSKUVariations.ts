import { useMemo } from 'react'

import type { ProductDetailsFragment_ProductFragment } from '@generated/graphql'

type SKUVariants =
  ProductDetailsFragment_ProductFragment['isVariantOf']['hasVariant']

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

function findSkuVariationImage(
  availableImages: Array<{
    url: string
    alternateName: string
  }>,
  skuVariationImageAlt = 'skuvariation'
) {
  return (
    availableImages.find(
      (imageProperties) =>
        imageProperties.alternateName === skuVariationImageAlt
    ) ?? availableImages[0]
  )
}

export function useSKUVariations(variants: SKUVariants, mainVariant: string) {
  return useMemo(() => {
    const optionsByType: SKUOptionsByType = {}
    const slugsMap: Record<string, string> = {}

    const variationsByMainVariationValues: Record<
      string,
      Record<string, string[]>
    > = {}

    // Avoid duplicated values
    const previouslySeenPropertyIDs: Record<string, number> = {}

    variants.forEach((variant) => {
      if (
        !variant.additionalProperty ||
        variant.additionalProperty.length === 0
      ) {
        return
      }

      let skuVariantKey = `${mainVariant}-${
        variant.additionalProperty.find(
          (variationDetails) => variationDetails.name === mainVariant
        )?.value ?? ''
      }-`

      variant.additionalProperty.forEach((property) => {
        skuVariantKey +=
          property.name === mainVariant
            ? ''
            : `${property.name}-${property.value}-`

        if (previouslySeenPropertyIDs[property.propertyID]) {
          return
        }

        const isColorVariant = property.name === 'Color'
        const variantImageToUse = findSkuVariationImage(variant.image)
        const propertyToAdd = isColorVariant
          ? {
              src: variantImageToUse.url,
              alt: variantImageToUse.alternateName,
              label: property.value,
              value: property.value,
            }
          : {
              label: property.value,
              value: property.value,
            }

        if (optionsByType[property.name]) {
          optionsByType[property.name].push(propertyToAdd)
        } else {
          optionsByType[property.name] = [propertyToAdd]
        }

        previouslySeenPropertyIDs[property.propertyID] = 1
      })

      slugsMap[skuVariantKey.slice(0, skuVariantKey.length - 1)] = variant.slug
    })

    Object.keys(slugsMap).forEach((variantCombination) => {
      const [, mainVariantCurrentValue, ...propertiesAndValueCombinations] =
        variantCombination.split('-')

      if (!variationsByMainVariationValues[mainVariantCurrentValue]) {
        variationsByMainVariationValues[mainVariantCurrentValue] = {}
      }

      for (
        let index = 1;
        index < propertiesAndValueCombinations.length;
        index += 2
      ) {
        const propertyName = propertiesAndValueCombinations[index - 1]
        const propertyValue = propertiesAndValueCombinations[index]

        if (
          variationsByMainVariationValues[mainVariantCurrentValue][propertyName]
        ) {
          variationsByMainVariationValues[mainVariantCurrentValue][
            propertyName
          ].push(propertyValue)
        } else {
          variationsByMainVariationValues[mainVariantCurrentValue][
            propertyName
          ] = [propertyValue]
        }
      }
    })

    return {
      optionsByType,
      slugsMap,
      variationsByMainVariationValues,
    }
  }, [mainVariant, variants])
}
