import type { PropsWithChildren } from 'react'

import Shimmer from '../Shimmer'
import Skeleton from '../Skeleton'
import styles from './filter-skeleton.module.scss'

interface FilterSkeletonProps {
  loading?: boolean
}

function FilterSkeleton({
  children,
  loading = true,
}: PropsWithChildren<FilterSkeletonProps>) {
  return loading ? (
    <div className={styles.fsFilterSkeleton} data-fs-filter-skeleton>
      <Skeleton shimmer variant="text" data-fs-filter-skeleton-title />

      <div data-fs-filter-skeleton-content>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Shimmer />
      </div>
    </div>
  ) : (
    <>{children}</>
  )
}

export default FilterSkeleton
