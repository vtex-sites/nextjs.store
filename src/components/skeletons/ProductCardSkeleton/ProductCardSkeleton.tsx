import Shimmer from '../Shimmer'
import Skeleton from '../Skeleton'
import styles from './product-card-skeleton.module.scss'

interface ProductCardSkeletonProps {
  bordered?: boolean
  sectioned?: boolean
  displayButton?: boolean
  variant?: 'default' | 'wide'
}

function ProductCardSkeleton({
  bordered,
  sectioned,
  displayButton,
  variant = 'default',
}: ProductCardSkeletonProps) {
  return (
    <div
      className={styles.fsProductCardSkeleton}
      data-fs-product-card-skeleton
      data-fs-product-card-skeleton-variant={variant}
      data-fs-product-card-skeleton-bordered={bordered}
      data-fs-product-card-skeleton-sectioned={sectioned}
    >
      <div data-fs-product-card-skeleton-image>
        <Skeleton variant="image" />
      </div>
      <div data-fs-product-card-skeleton-content>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="badge" />
        {displayButton && <Skeleton variant="button" />}
      </div>
      <Shimmer />
    </div>
  )
}

export default ProductCardSkeleton
