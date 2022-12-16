import type { ReactNode } from 'react'
import {
  Hero as UIHero,
  HeroHeading as UIHeroHeading,
  HeroImage as UIHeroImage,
} from '@faststore/ui'

import Section from '../Section'

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
  linkText,
  link,
  icon,
  imageAlt,
  imageSrc,
}: HeroProps) => {
  return (
    <Section>
      <UIHero>
        <UIHeroImage imageAlt={imageAlt} imageSrc={imageSrc} />
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
