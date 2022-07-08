import { useMemo } from 'react'

import type { ProductDetailsFragment_ProductFragment } from '@generated/graphql'

export type SkuVariants =
  ProductDetailsFragment_ProductFragment['isVariantOf']['hasVariant']

export type SkuOptionsByName = Record<
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

export function useSkuVariants(variants: SkuVariants, mainVariant: string) {
  return useMemo(() => {
    /**
     * Maps property value combinations to their respective SKU's slug. Enables
     * us to retrieve the slug for the SKU that matches the currently selected
     * variations in O(1) time.
     *
     * Example: `'Color-Red-Size-40': 'classic-shoes-37'`
     */
    const slugsMap: Record<string, string> = {}

    /**
     * SKU options already formatted and indexed by their property name.
     *
     * Ex: {
     *   `Size`: [
     *     { label: '42', value: '42' },
     *     { label: '41', value: '41' },
     *     { label: '39', value: '39' },
     *   ]
     * }
     */
    const optionsByName: SkuOptionsByName = {}

    /**
     * Filtered possible variations for each possible value of the `mainVariant`
     * property.
     */
    const availableVariationsByDominantValue: Record<
      string,
      Record<string, string[]>
    > = {}

    const previouslySeenPropertyIDs: Record<string, number> = {}

    variants.forEach((variant) => {
      const skuSpecificationProperties = variant.additionalProperty.filter(
        (property) =>
          property.valueReference === 'SPECIFICATION' &&
          property.name !== mainVariant
      )

      if (skuSpecificationProperties.length === 0) {
        return
      }

      // Make sure that the 'name-value' pair for the `mainVariant` variation
      // is always the first one.
      let skuVariantKey = `${mainVariant}-${
        variant.additionalProperty.find(
          (variationDetails) => variationDetails.name === mainVariant
        )?.value ?? ''
      }`

      skuSpecificationProperties.forEach((property) => {
        skuVariantKey += `-${property.name}-${property.value}`

        if (previouslySeenPropertyIDs[property.propertyID]) {
          return
        }

        previouslySeenPropertyIDs[property.propertyID] = 1

        const variantImageToUse = findSkuVariationImage(variant.image)

        const formattedPropertyOption = {
          src: variantImageToUse.url,
          alt: variantImageToUse.alternateName,
          label: property.value,
          value: property.value,
        }

        if (optionsByName[property.name]) {
          optionsByName[property.name].push(formattedPropertyOption)
        } else {
          optionsByName[property.name] = [formattedPropertyOption]
        }
      })

      slugsMap[skuVariantKey] = variant.slug
    })

    Object.keys(slugsMap).forEach((variantCombination) => {
      const [, mainVariantCurrentValue, ...propertiesAndValueCombinations] =
        variantCombination.split('-')

      if (!availableVariationsByDominantValue[mainVariantCurrentValue]) {
        availableVariationsByDominantValue[mainVariantCurrentValue] = {}
      }

      for (
        let index = 1;
        index < propertiesAndValueCombinations.length;
        index += 2
      ) {
        const propertyName = propertiesAndValueCombinations[index - 1]
        const propertyValue = propertiesAndValueCombinations[index]

        if (
          availableVariationsByDominantValue[mainVariantCurrentValue][
            propertyName
          ]
        ) {
          availableVariationsByDominantValue[mainVariantCurrentValue][
            propertyName
          ].push(propertyValue)
        } else {
          availableVariationsByDominantValue[mainVariantCurrentValue][
            propertyName
          ] = [propertyValue]
        }
      }
    })

    return {
      optionsByType: optionsByName,
      slugsMap,
      variationsByMainVariationValues: availableVariationsByDominantValue,
    }
  }, [mainVariant, variants])
}
