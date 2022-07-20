import { Banner, BannerContent } from '@faststore/ui'
import type { HTMLAttributes } from 'react'

import Newsletter from '../Newsletter'
import Section from '../Section'

type BannerTextVariant =
  | {
      variant?: 'primary'
      /**
       * The content for the h2 tag.
       */
      title: string
      caption?: never
    }
  | {
      variant: 'secondary'
      /**
       * The content for the h2 tag.
       */
      title: string
      /**
       * The content for the p tag below the h2.
       */
      caption: string
    }

interface BaseProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The href used at the link
   */
  actionPath?: string
  /**
   * The label used at the link
   */
  actionLabel: string
  /**
   * Color variant combinations
   * @default: 'main'
   */
  colorVariant?: 'main' | 'light' | 'accent'
}

export type BannerTextProps = BaseProps & BannerTextVariant

function BannerText({
  title,
  caption,
  actionLabel,
  variant = 'primary',
  colorVariant = 'main',
}: BannerTextProps) {
  return (
    <Section className="layout__section">
      <Banner
        data-fs-banner-text
        data-fs-banner-text-variant={variant}
        data-fs-banner-text-color-variant={colorVariant}
      >
        <BannerContent data-fs-banner-text-content className="layout__content">
          <div
            data-fs-banner-text-heading
            data-fs-banner-text-color-variant={colorVariant}
          >
            <h2>{title}</h2>
            {variant === 'secondary' && caption && <p>{caption}</p>}
          </div>
          <Newsletter title={actionLabel} />
        </BannerContent>
      </Banner>
    </Section>
  )
}

export default BannerText
