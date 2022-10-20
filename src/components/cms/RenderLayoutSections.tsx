/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType } from 'react'

import Alert from 'src/components/common/Alert'

import SectionBoundary from './SectionBoundary'

/**
 * Sections: Components imported from '../components/common' only.
 * Do not import or render components from any other folder in here.
 */
const COMPONENTS: Record<string, ComponentType<any>> = {
  Alert,
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
// prevent Cumulative Layout Shift (CLS)
const fallbackSessions: Array<{ name: string; data: any }> = [
  {
    name: 'Alert',
    data: {
      link: {
        text: 'Buy now',
        to: '/office',
      },
      dismissible: true,
      icon: 'Bell',
      content: 'Get 10% off today',
    },
  },
]

interface Props {
  sections?: Array<{ name: string; data: any }>
}

const RenderLayoutSections = ({ sections = fallbackSessions }: Props) => (
  <>
    {sections?.map(({ name, data }, index) => {
      const Component = COMPONENTS[name]

      if (!Component) {
        console.info(
          `Could not find component for block ${name}. Add a new component for this block or remove it from the CMS`
        )

        return <></>
      }

      return (
        <SectionBoundary key={`cms-layout-section-${index}`} name={name}>
          <Component {...data} />
        </SectionBoundary>
      )
    })}
  </>
)

export default RenderLayoutSections
