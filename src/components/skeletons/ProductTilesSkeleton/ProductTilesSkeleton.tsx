import type { PropsWithChildren } from 'react'

import Tiles, { Tile } from 'src/components/ui/Tiles'

import ProductTileSkeleton from './ProductTileSkeleton'

// TODO: // Replace it when items number become dynamically defined
const DEFAULT_ITEMS_NUMBER = 3

interface Props {
  loading?: boolean
  variant?: 'wide' | 'default'
  title?: string
}

function ProductTilesSkeleton({
  children,
  loading = true,
  variant = 'default',
  title,
}: PropsWithChildren<Props>) {
  return loading ? (
    <Tiles>
      {title && <h2 className="text__title-section">{title}</h2>}
      {Array.from({ length: DEFAULT_ITEMS_NUMBER }, (_, index) => (
        <Tile key={String(index)}>
          <ProductTileSkeleton tileIndex={index + 1} variant={variant} />
        </Tile>
      ))}
    </Tiles>
  ) : (
    <>{children}</>
  )
}

export default ProductTilesSkeleton
