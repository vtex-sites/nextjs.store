import {
  Hero as UIHero,
  HeroHeading as UIHeroHeading,
  HeroImage as UIHeroImage,
} from '@faststore/ui'
import type {
  HeroProps as UIHeroProps,
  HeroImageProps as UIHeroImageProps,
  HeroHeadingProps as UIHeroHeadingProps,
} from '@faststore/ui'

import Section from '../Section'

export type HeroProps = UIHeroProps & UIHeroHeadingProps & UIHeroImageProps

const Hero = ({
  icon,
  link,
  title,
  subtitle,
  linkText,
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
