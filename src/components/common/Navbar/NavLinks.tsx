import { List as UIList } from '@faststore/ui'
import type { AnchorHTMLAttributes } from 'react'

import RegionalizationButton from 'src/components/regionalization/RegionalizationButton'
import Link from 'src/components/ui/Link'
import { mark } from 'src/sdk/tests/mark'

import styles from './navlinks.module.scss'

interface NavLinksProps {
  onClickLink?: AnchorHTMLAttributes<HTMLAnchorElement>['onClick']
  classes?: string
}

const collections = [
  {
    name: 'Office',
    href: '/office',
  },
  {
    name: 'Home Appliances',
    href: '/kitchen---home-appliances',
  },
  {
    name: 'Computer and Software',
    href: '/computer---software',
  },
  {
    name: 'Technology',
    href: '/technology',
  },
]

function NavLinks({ onClickLink, classes = '' }: NavLinksProps) {
  return (
    <nav className={`${styles.fsNavlinks} ${classes}`}>
      <UIList data-fs-navlinks-list>
        <li data-fs-navlinks-list-item>
          <RegionalizationButton classes="hidden-mobile" />
        </li>
        {collections.map(({ href, name }) => (
          <li key={name} data-fs-navlinks-list-item>
            <Link
              data-fs-navlinks-link
              variant="display"
              href={href}
              onClick={onClickLink}
            >
              {name}
            </Link>
          </li>
        ))}
      </UIList>
    </nav>
  )
}

export default mark(NavLinks)
