import type { PropsWithChildren } from 'react'
import { Skeleton as UISkeleton } from '@faststore/ui'

import Shimmer from '../Shimmer'
import styles from './skeleton.module.scss'

type Variant = 'text' | 'button' | 'image' | 'badge'

interface SkeletonProps {
  loading?: boolean
  shimmer?: boolean
  variant: Variant
}

function Skeleton({
  variant,
  children,
  loading = true,
  shimmer = false,
}: PropsWithChildren<SkeletonProps>) {
  return loading ? (
    <div
      data-fs-skeleton-wrapper
      data-fs-skeleton-shimmer={shimmer}
      className={styles.fsSkeleton}
    >
      <UISkeleton data-fs-skeleton data-fs-skeleton-variant={variant} />
      {shimmer && <Shimmer />}
    </div>
  ) : (
    <>{children}</>
  )
}

export default Skeleton
