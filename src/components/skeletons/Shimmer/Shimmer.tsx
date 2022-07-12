import styles from './shimmer.module.scss'

function Shimmer() {
  return (
    <div className={styles.fsShimmer} data-fs-shimmer>
      <div data-fs-shimmer-bkg />
    </div>
  )
}

export default Shimmer
