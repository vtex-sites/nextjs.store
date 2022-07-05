import { useState } from 'react'
import { useRouter } from 'next/router'
import type { NextRouter } from 'next/router'

import type { ProductDetailsFragment_ProductFragment } from '@generated/graphql'

import SkuSelector from './SkuSelector'
import { useSKUVariations } from '../../sections/ProductDetails/useSKUVariations'

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

const DOMINANT_SKU_SELECTOR_PROPERTY = 'Color'

function getSkuSlug(
  slugsMap: Record<string, string>,
  selectedVariations: Record<string, string>,
  dominantVariation: string
) {
  let slugsMapKey = ''

  for (const key in selectedVariations) {
    if (Object.prototype.hasOwnProperty.call(selectedVariations, key)) {
      const variationValue = selectedVariations[key]

      slugsMapKey += `${key}-${variationValue}-`
    }
  }

  // Remove trailing '-'
  slugsMapKey = slugsMapKey.slice(0, slugsMapKey.length - 1)

  const variantExists = Boolean(slugsMap[slugsMapKey])

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

function SkuSelectors({ options, productId }: Props) {
  const router = useRouter()

  const [selectedVariations, setSelectedVariations] = useState(() =>
    getSelectedVariations(productId, options)
  )

  const { optionsByType, slugsMap, variationsByMainVariationValues } =
    useSKUVariations(options, DOMINANT_SKU_SELECTOR_PROPERTY)

  const filteredOptionsByCurrentColor = getAvailableVariationsForSelectedColor(
    selectedVariations.Color,
    optionsByType,
    variationsByMainVariationValues
  )

  // 'Color' variants are singled-out here because they will always be rendered
  // as 'image' variants.
  const { Color: colorVariants, ...otherSKUVariants } =
    filteredOptionsByCurrentColor

  return (
    <section>
      {colorVariants && (
        <SkuSelector
          variant="image"
          defaultSku={selectedVariations.Color}
          options={colorVariants}
          onChange={(e) => {
            const newVariationValue = e.currentTarget.value

            setSelectedVariations({
              ...selectedVariations,
              Color: newVariationValue,
            })

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
            key={skuVariant}
            variant="label"
            defaultSku={selectedVariations[skuVariant]}
            options={otherSKUVariants[skuVariant]}
            onChange={(e) => {
              const newVariationValue = e.currentTarget.value

              setSelectedVariations({
                ...selectedVariations,
                [skuVariant]: newVariationValue,
              })

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
    </section>
  )
}

export default SkuSelectors
