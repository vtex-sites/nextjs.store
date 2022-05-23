import { Fragment, memo } from 'react'
import Head from 'next/head'
import type { HTMLAttributes } from 'react'

import { useSources } from './useSources'
import type { SourceOptions } from './useSources'
import type { ImageOptions } from './useImage'

interface Props extends HTMLAttributes<HTMLPictureElement> {
  sources: SourceOptions[]
  img: ImageOptions
  preload?: boolean
}

function Picture({
  sources: sourceOptions,
  img: imgProps,
  preload = false,
  ...otherProps
}: Props) {
  const sources = useSources(sourceOptions)

  return (
    <picture>
      {sources.map(({ srcSet, media, height, preloadLinks }, index) => {
        return (
          <Fragment key={index}>
            {preload && (
              <Head>
                {preloadLinks.map((href: string, idx: number) => (
                  <link
                    key={idx}
                    as="image"
                    rel="preload"
                    href={href}
                    media={media}
                  />
                ))}
              </Head>
            )}
            <source key={index} srcSet={srcSet} media={media} height={height} />
          </Fragment>
        )
      })}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...imgProps} alt={imgProps.alt} {...otherProps} />
    </picture>
  )
}

export default memo(Picture)
