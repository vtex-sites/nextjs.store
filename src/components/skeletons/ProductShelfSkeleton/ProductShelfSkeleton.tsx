import type { PropsWithChildren } from 'react'

import { ITEMS_PER_SECTION } from 'src/constants'

import ProductCardSkeleton from '../ProductCardSkeleton'

interface Props {
  loading?: boolean
  title?: string
}

function ProductShelfSkeleton({
  children,
  loading = true,
  title,
}: PropsWithChildren<Props>) {
  return loading ? (
    <>
      {title && (
        <h2 className="text__title-section layout__content">{title}</h2>
      )}
      <ul data-fs-product-shelf-items className="layout__content">
        {Array.from({ length: ITEMS_PER_SECTION }, (_, index) => (
          <li key={String(index)}>
            <ProductCardSkeleton sectioned />
          </li>
        ))}
      </ul>
    </>
  ) : (
    <>{children}</>
  )
}

export default ProductShelfSkeleton
