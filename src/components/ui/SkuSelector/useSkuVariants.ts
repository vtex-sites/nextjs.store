import { useMemo } from 'react'

import type { ProductDetailsFragment_ProductFragment } from '@generated/graphql'

export type SkuVariants =
  ProductDetailsFragment_ProductFragment['isVariantOf']['hasVariant']

export type SkuVariantsByName = Record<
  string,
  Array<
    | {
        label: string
        value: string
      }
    | { alt: string; src: string; label: string; value: string }
  >
>

function findSkuVariantImage(
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
    const variantsByName: SkuVariantsByName = {}

    /**
     * Filtered possible variations for each possible value of the `mainVariant`
     * property.
     */
    const availableVariantsByDominantValue: Record<
      string,
      Record<string, string[]>
    > = {}

    const previouslySeenPropertyIDs: Record<string, number> = {}

    variants.forEach((variant) => {
      const skuSpecificationProperties = variant.additionalProperty.filter(
        (property) => property.valueReference === 'SPECIFICATION'
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
        skuVariantKey +=
          property.name !== mainVariant
            ? `-${property.name}-${property.value}`
            : ''

        if (previouslySeenPropertyIDs[property.propertyID]) {
          return
        }

        previouslySeenPropertyIDs[property.propertyID] = 1

        const variantImageToUse = findSkuVariantImage(variant.image)

        const formattedVariant = {
          src: variantImageToUse.url,
          alt: variantImageToUse.alternateName,
          label: property.value,
          value: property.value,
        }

        if (variantsByName[property.name]) {
          variantsByName[property.name].push(formattedVariant)
        } else {
          variantsByName[property.name] = [formattedVariant]
        }
      })

      slugsMap[skuVariantKey] = variant.slug
    })

    Object.keys(slugsMap).forEach((variantCombination) => {
      const [, mainVariantCurrentValue, ...propertiesAndValueCombinations] =
        variantCombination.split('-')

      if (!availableVariantsByDominantValue[mainVariantCurrentValue]) {
        availableVariantsByDominantValue[mainVariantCurrentValue] = {}
      }

      for (
        let index = 1;
        index < propertiesAndValueCombinations.length;
        index += 2
      ) {
        const propertyName = propertiesAndValueCombinations[index - 1]
        const propertyValue = propertiesAndValueCombinations[index]

        if (
          availableVariantsByDominantValue[mainVariantCurrentValue][
            propertyName
          ]
        ) {
          availableVariantsByDominantValue[mainVariantCurrentValue][
            propertyName
          ].push(propertyValue)
        } else {
          availableVariantsByDominantValue[mainVariantCurrentValue][
            propertyName
          ] = [propertyValue]
        }
      }
    })

    return {
      variantsByName,
      slugsMap,
      availableVariantsByDominantValue,
    }
  }, [mainVariant, variants])
}
