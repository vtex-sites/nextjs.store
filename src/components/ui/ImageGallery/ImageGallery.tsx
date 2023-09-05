import { useState } from 'react'
import type { HTMLAttributes } from 'react'
import styles from 'src/components/ui/ImageGallery/image-gallery.module.scss'

import { ImageGallerySelector, ImageZoom } from '.'

export interface ImageElementData {
  url: string
  alternateName: string
}

interface ImageGalleryProps extends HTMLAttributes<HTMLDivElement> {
  images: ImageElementData[]
}

function ImageGallery({ images, ...otherProps }: ImageGalleryProps) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const hasSelector = images.length > 1

  return (
    <section
      data-fs-image-gallery={hasSelector ? 'with-selector' : 'without-selector'}
      className={styles.fsImageGallery}
      {...otherProps}
    >
      <ImageZoom />
      {hasSelector && (
        <ImageGallerySelector
          images={images}
          currentImageIdx={selectedImageIdx}
          onSelect={setSelectedImageIdx}
        />
      )}
    </section>
  )
}

export default ImageGallery
