import { forwardRef, useMemo } from 'react'
import type { Ref, ElementType, AnchorHTMLAttributes } from 'react'
import NextLink from 'next/link'
import type { LinkProps as FrameworkLinkProps } from 'next/link'
import { Link as UILink } from '@faststore/ui'
import type { LinkProps as UILinkProps } from '@faststore/ui'

import styles from './link.module.scss'

function externalLinkChecker(href: string) {
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
    externalLink?: boolean
  }

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link<
  T extends ElementType = 'a'
>(
  {
    href,
    inverse,
    children,
    externalLink,
    variant = 'default',
    ...otherProps
  }: LinkProps<T>,
  ref: Ref<HTMLAnchorElement> | undefined
) {
  const isExternalLink = useMemo(() => externalLinkChecker(href), [href])

  if (externalLink || isExternalLink) {
    return (
      <UILink
        ref={ref}
        href={href}
        data-fs-link
        data-fs-link-variant={variant}
        data-fs-link-inverse={inverse}
        className={styles.fsLink}
        {...otherProps}
      >
        {children}
      </UILink>
    )
  }

  return (
    <NextLink passHref href={href}>
      <UILink
        ref={ref}
        data-fs-link
        data-fs-link-variant={variant}
        data-fs-link-inverse={inverse}
        className={styles.fsLink}
        {...otherProps}
      >
        {children}
      </UILink>
    </NextLink>
  )
})

export default Link
