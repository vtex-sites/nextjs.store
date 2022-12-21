import type { ReactNode } from 'react'
import {
  Hero as UIHero,
  HeroHeading as UIHeroHeading,
  HeroImage as UIHeroImage,
} from '@faststore/ui'

import Image from 'src/components/ui/Image/Image'

import Section from '../Section'
import styles from './hero.module.scss'

type Variant = 'primary' | 'secondary'
type ColorVariant = 'main' | 'light' | 'accent'

export interface HeroProps {
  /**
   * Content for the h1 tag.
   */
  title: string
  /**
   * Content for the p tag.
   */
  subtitle: string
  /**
   * Specifies the component variant.
   */
  variant?: Variant
  /**
   * Specifies the component's color variant combination.
   */
  colorVariant?: ColorVariant
  /**
   * Specifies the URL the action button goes to.
   */
  link?: string
  /**
   * Specifies the action button's content.
   */
  linkText?: string
  /**
   * Icon component for additional customization.
   */
  icon?: ReactNode
  /**
   * Specifies the image URL.
   */
  imageSrc: string
  /**
   * Alternative description of the image.
   */
  imageAlt: string
}

const Hero = ({
  title,
  subtitle,
  variant = 'primary',
  colorVariant = 'main',
  linkText,
  link,
  icon,
  imageAlt,
  imageSrc,
}: HeroProps) => {
  return (
    <Section>
      <UIHero
        className={styles.fsHero}
        data-fs-hero
        data-fs-hero-variant={variant}
        data-fs-hero-color-variant={colorVariant}
      >
        <UIHeroImage data-fs-hero-image>
          <Image
            preload
            loading="eager"
            fetchPriority="high"
            src={imageSrc}
            alt={imageAlt}
            width={360}
            height={240}
            sizes="(max-width: 768px) 70vw, 50vw"
          />
        </UIHeroImage>
        <UIHeroHeading
          title={title}
          subtitle={subtitle}
          link={link}
          linkText={linkText}
          icon={icon}
        />
      </UIHero>
    </Section>
  )
}

export default Hero
