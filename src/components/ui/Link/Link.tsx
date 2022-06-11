import { forwardRef } from 'react'
import type { Ref, ElementType, AnchorHTMLAttributes } from 'react'
import NextLink from 'next/link'
import type { LinkProps as FrameworkLinkProps } from 'next/link'
import { Link as UILink } from '@faststore/ui'
import type { LinkProps as UILinkProps } from '@faststore/ui'

import styles from './link.module.scss'

function isExternalLink(href: string) {
  return (
    href.startsWith('//') ||
    href.startsWith('http://') ||
    href.startsWith('https://')
  )
}

type Variant = 'default' | 'display' | 'footer' | 'inline'

export type LinkProps<T extends ElementType = 'a'> = UILinkProps<T> &
  FrameworkLinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    variant?: Variant
    inverse?: boolean
  }

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link<
  T extends ElementType = 'a'
>(
  { href, inverse, children, variant = 'default', ...otherProps }: LinkProps<T>,
  ref: Ref<HTMLAnchorElement> | undefined
) {
  const defaultProps = {
    'data-fs-link': true,
    'data-fs-link-variant': variant,
    'data-fs-link-inverse': inverse,
    className: styles.fsLink,
  }

  if (isExternalLink(href)) {
    return (
      <UILink ref={ref} href={href} {...defaultProps} {...otherProps}>
        {children}
      </UILink>
    )
  }

  return (
    <NextLink passHref href={href}>
      <UILink ref={ref} {...defaultProps} {...otherProps}>
        {children}
      </UILink>
    </NextLink>
  )
})

export default Link
