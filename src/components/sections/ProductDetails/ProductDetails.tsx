import { gql } from '@faststore/graphql-utils'
import { sendAnalyticsEvent } from '@faststore/sdk'
import { useEffect, useState } from 'react'
import type { CurrencyCode, ViewItemEvent } from '@faststore/sdk'
import { useRouter } from 'next/router'
import type { NextRouter } from 'next/router'

import OutOfStock from 'src/components/product/OutOfStock'
import { DiscountBadge } from 'src/components/ui/Badge'
import Breadcrumb from 'src/components/ui/Breadcrumb'
import { ButtonBuy } from 'src/components/ui/Button'
import { ImageGallery } from 'src/components/ui/ImageGallery'
import Price from 'src/components/ui/Price'
import ProductTitle from 'src/components/ui/ProductTitle'
import QuantitySelector from 'src/components/ui/QuantitySelector'
import SkuSelector from 'src/components/ui/SkuSelector'
import { useBuyButton } from 'src/sdk/cart/useBuyButton'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import { useProduct } from 'src/sdk/product/useProduct'
import { useSession } from 'src/sdk/session'
import type { ProductDetailsFragment_ProductFragment } from '@generated/graphql'
import type { AnalyticsItem } from 'src/sdk/analytics/types'

import Section from '../Section'
import { useSKUVariations } from './useSKUVariations'

interface Props {
  product: ProductDetailsFragment_ProductFragment
}

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

// function handleSkuSelectorChange(event: ChangeEvent<HTMLInputElement>) {}

function ProductDetails({ product: staleProduct }: Props) {
  const { currency } = useSession()
  const [addQuantity, setAddQuantity] = useState(1)
  const router = useRouter()

  // Stale while revalidate the product for fetching the new price etc
  const { data, isValidating } = useProduct(staleProduct.id, {
    product: staleProduct,
  })

  if (!data) {
    throw new Error('NotFound')
  }

  const {
    product: {
      id,
      sku,
      gtin,
      description,
      name: variantName,
      brand,
      isVariantOf,
      isVariantOf: { name, productGroupID: productId, hasVariant },
      image: productImages,
      offers: {
        offers: [{ availability, price, listPrice, seller }],
        lowPrice,
      },
      breadcrumbList: breadcrumbs,
      additionalProperty,
    },
  } = data

  const selectedVariations = getSelectedVariations(sku, hasVariant)

  const { optionsByType, slugsMap, variationsByMainVariationValues } =
    useSKUVariations(hasVariant, DOMINANT_SKU_SELECTOR_PROPERTY)

  const filteredOptionsByCurrentColor = getAvailableVariationsForSelectedColor(
    selectedVariations.Color,
    optionsByType,
    variationsByMainVariationValues
  )

  // 'Color' variants are singled-out here because they will always be rendered
  // as 'image' variants.
  const { Color: colorVariants, ...otherSKUVariants } =
    filteredOptionsByCurrentColor

  const buyDisabled = availability !== 'https://schema.org/InStock'

  const buyProps = useBuyButton({
    id,
    price,
    listPrice,
    seller,
    quantity: addQuantity,
    itemOffered: {
      sku,
      name: variantName,
      gtin,
      image: productImages,
      brand,
      isVariantOf,
      additionalProperty,
    },
  })

  useEffect(() => {
    sendAnalyticsEvent<ViewItemEvent<AnalyticsItem>>({
      name: 'view_item',
      params: {
        currency: currency.code as CurrencyCode,
        value: price,
        items: [
          {
            item_id: isVariantOf.productGroupID,
            item_name: isVariantOf.name,
            item_brand: brand.name,
            item_variant: sku,
            price,
            discount: listPrice - price,
            currency: currency.code as CurrencyCode,
            item_variant_name: variantName,
            product_reference_id: gtin,
          },
        ],
      },
    })
  }, [
    isVariantOf.productGroupID,
    isVariantOf.name,
    brand.name,
    sku,
    price,
    listPrice,
    currency.code,
    variantName,
    gtin,
  ])

  return (
    <Section className="product-details layout__content layout__section">
      <Breadcrumb breadcrumbList={breadcrumbs.itemListElement} />

      <section className="product-details__body">
        <header className="product-details__title">
          <ProductTitle
            title={<h1>{name}</h1>}
            label={
              <DiscountBadge listPrice={listPrice} spotPrice={lowPrice} big />
            }
            refNumber={productId}
          />
        </header>

        <ImageGallery images={productImages} />

        <section className="product-details__settings">
          <section>
            {colorVariants && (
              <SkuSelector
                variant="image"
                defaultSku={selectedVariations.Color}
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
                  key={skuVariant}
                  variant="label"
                  defaultSku={selectedVariations[skuVariant]}
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
          </section>
          <section className="product-details__values">
            <div className="product-details__prices">
              <Price
                value={listPrice}
                formatter={useFormattedPrice}
                testId="list-price"
                data-value={listPrice}
                variant="listing"
                classes="text__legend"
                SRText="Original price:"
              />
              <Price
                value={lowPrice}
                formatter={useFormattedPrice}
                testId="price"
                data-value={lowPrice}
                variant="spot"
                classes="text__lead"
                SRText="Sale Price:"
              />
            </div>
            {/* <div className="prices">
              <p className="price__old text__legend">{formattedListPrice}</p>
              <p className="price__new">{isValidating ? '' : formattedPrice}</p>
            </div> */}
            <QuantitySelector min={1} max={10} onChange={setAddQuantity} />
          </section>
          {/* NOTE: A loading skeleton had to be used to avoid a Lighthouse's
              non-composited animation violation due to the button transitioning its
              background color when changing from its initial disabled to active state.
              See full explanation on commit https://git.io/JyXV5. */}
          {isValidating ? (
            <AddToCartLoadingSkeleton />
          ) : (
            <ButtonBuy disabled={buyDisabled} {...buyProps}>
              Add to Cart
            </ButtonBuy>
          )}
          {!availability && (
            <OutOfStock
              onSubmit={(email) => {
                console.info(email)
              }}
            />
          )}
        </section>

        <section className="product-details__content">
          <article className="product-details__description">
            <h2 className="text__title-subsection">Description</h2>
            <p className="text__body">{description}</p>
          </article>
        </section>
      </section>
    </Section>
  )
}

function AddToCartLoadingSkeleton() {
  // Generated via https://skeletonreact.com/.
  return (
    <svg
      role="img"
      width="100%"
      height="48"
      aria-labelledby="loading-aria"
      viewBox="0 0 112 48"
      preserveAspectRatio="none"
    >
      <title id="loading-aria">Loading...</title>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        clipPath="url(#clip-path)"
        style={{ fill: 'url("#fill")' }}
      />
      <defs>
        <clipPath id="clip-path">
          <rect x="0" y="0" rx="2" ry="2" width="112" height="48" />
        </clipPath>
        <linearGradient id="fill">
          <stop offset="0.599964" stopColor="#f3f3f3" stopOpacity="1">
            <animate
              attributeName="offset"
              values="-2; -2; 1"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="1.59996" stopColor="#ecebeb" stopOpacity="1">
            <animate
              attributeName="offset"
              values="-1; -1; 2"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="2.59996" stopColor="#f3f3f3" stopOpacity="1">
            <animate
              attributeName="offset"
              values="0; 0; 3"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
      </defs>
    </svg>
  )
}

export const fragment = gql`
  fragment ProductDetailsFragment_product on StoreProduct {
    id: productID
    sku
    name
    gtin
    description

    isVariantOf {
      productGroupID
      name
      hasVariant {
        slug
        name
        productID
        seo {
          title
        }
        image {
          url
          alternateName
        }
        additionalProperty {
          propertyID
          value
          name
          valueReference
        }
      }
    }

    image {
      url
      alternateName
    }

    brand {
      name
    }

    offers {
      lowPrice
      offers {
        availability
        price
        listPrice
        seller {
          identifier
        }
      }
    }

    breadcrumbList {
      itemListElement {
        item
        name
        position
      }
    }

    additionalProperty {
      propertyID
      name
      value
      valueReference
    }
  }
`

export default ProductDetails
