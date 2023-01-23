import type { PropsWithChildren } from 'react'

import { Skeleton as UISkeleton } from '@faststore/ui'
import styles from './filter-skeleton.module.scss'
interface FilterSkeletonProps {
  /**
   * Control whether skeleton should be visible or not.
   */
  loading?: boolean
}

function FilterSkeleton({
  children,
  loading = true,
}: PropsWithChildren<FilterSkeletonProps>) {
  return loading ? (
    <div className={styles.fsFilterSkeleton} data-fs-filter-skeleton>
      <UISkeleton
        data-fs-filter-skeleton-text
        shimmer
        size={{ width: '100%', height: '1.5rem' }}
      />

      <div data-fs-filter-skeleton-content>
        <UISkeleton
          data-fs-filter-skeleton-text
          size={{ width: '100%', height: '1.5rem' }}
        />
        <UISkeleton
          data-fs-filter-skeleton-text
          size={{ width: '100%', height: '1.5rem' }}
        />
        <UISkeleton
          data-fs-filter-skeleton-text
          size={{ width: '100%', height: '1.5rem' }}
        />
      </div>
    </div>
  ) : (
    <>{children}</>
  )
}

export default FilterSkeleton
