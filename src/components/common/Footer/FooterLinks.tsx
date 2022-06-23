import { useState } from 'react'
import { List as UIList } from '@faststore/ui'

import Link from 'src/components/ui/Link'
import Accordion, { AccordionItem } from 'src/components/ui/Accordion'

const links = [
  {
    id: 'footer-our-company',
    title: 'Our company',
    items: [
      {
        href: '/',
        name: 'About Us',
      },
      {
        href: '/',
        name: 'Our Blog',
      },
      {
        href: '/',
        name: 'Stores',
      },
      {
        href: '/',
        name: 'Work With Us',
      },
    ],
  },
  {
    id: 'footer-orders-and-purchases',
    title: 'Orders & Purchases',
    items: [
      {
        href: '/',
        name: 'Check Order Status',
      },
      {
        href: '/',
        name: 'Returns and Exchanges',
      },
      {
        href: '/',
        name: 'Product Recall',
      },
      {
        href: '/',
        name: 'Gift Cards',
      },
    ],
  },
  {
    id: 'footer-support-and-services',
    title: 'Support & Services',
    items: [
      {
        href: '/',
        name: 'Support Center',
      },
      {
        href: '/',
        name: 'Schedule a Service',
      },
      {
        href: '/',
        name: 'Contact Us',
      },
    ],
  },
  {
    id: 'footer-partnership',
    title: 'Partnerships',
    items: [
      {
        href: '/',
        name: 'Affiliate Program',
      },
      {
        href: '/',
        name: 'Advertise with US',
      },
      {
        href: '/',
        name: 'Market Place',
      },
    ],
  },
]

type LinkItem = {
  href: string
  name: string
}

interface LinksListProps {
  items: LinkItem[]
}

function LinksList({ items }: LinksListProps) {
  return (
    <UIList>
      {items.map((item) => (
        <li key={item.name}>
          <Link variant="footer" href={item.href}>
            {item.name}
          </Link>
        </li>
      ))}
    </UIList>
  )
}

function FooterLinks() {
  const [indicesExpanded, setIndicesExpanded] = useState<Set<number>>(
    new Set([])
  )

  const onChange = (index: number) => {
    if (indicesExpanded.has(index)) {
      indicesExpanded.delete(index)
      setIndicesExpanded(new Set(indicesExpanded))
    } else {
      setIndicesExpanded(new Set(indicesExpanded.add(index)))
    }
  }

  return (
    <section className="footer__links">
      <div className="display-mobile">
        <Accordion expandedIndices={indicesExpanded} onChange={onChange}>
          {links.map((section, index) => (
            <AccordionItem
              key={section.title}
              isExpanded={indicesExpanded.has(index)}
              buttonLabel={section.title}
            >
              <LinksList items={section.items} />
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="hidden-mobile">
        <div className="footer__links-columns">
          {links.map((section) => (
            <nav key={section.title} aria-labelledby={section.id}>
              <p className="text__title-mini" id={section.id}>
                {section.title}
              </p>
              <LinksList items={section.items} />
            </nav>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FooterLinks
