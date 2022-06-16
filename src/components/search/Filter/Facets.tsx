import { Label as UILabel, List as UIList } from '@faststore/ui'

import type {
  Filter_FacetsFragment,
  IStoreSelectedFacet,
} from '@generated/graphql'
import Accordion, { AccordionItem } from 'src/components/ui/Accordion'
import { Badge } from 'src/components/ui/Badge'
import Checkbox from 'src/components/ui/Checkbox'

import styles from './facets.module.scss'

interface FacetsProps {
  testId: string
  facets: Filter_FacetsFragment[]
  indicesExpanded: Set<number>
  onFacetChange: (item: IStoreSelectedFacet) => void
  onAccordionChange: (index: number) => void
}

function Facets({
  testId,
  facets,
  indicesExpanded,
  onFacetChange,
  onAccordionChange,
}: FacetsProps) {
  return (
    <div className={styles.fsFacets} data-testid={testId}>
      <h2 className="text__title-mini-alt" data-fs-facets-title>
        Filters
      </h2>
      <Accordion expandedIndices={indicesExpanded} onChange={onAccordionChange}>
        {facets.map(({ label, values, key }, index) => (
          <AccordionItem
            key={`${label}-${index}`}
            prefixId={testId}
            testId={`${testId}-accordion`}
            isExpanded={indicesExpanded.has(index)}
            buttonLabel={label}
          >
            <UIList>
              {values.map((item) => {
                const id = `${testId}-${label}-${item.label}`

                return (
                  <li key={id} data-fs-facet-item>
                    <Checkbox
                      id={id}
                      checked={item.selected}
                      onChange={() => onFacetChange({ key, value: item.value })}
                      data-fs-facet-item-checkbox
                      data-testid={`${testId}-accordion-panel-checkbox`}
                      data-value={item.value}
                      data-quantity={item.quantity}
                    />
                    <UILabel
                      htmlFor={id}
                      className="text__title-mini-alt"
                      data-fs-facet-item-label
                    >
                      {item.label}{' '}
                      <Badge data-fs-facet-item-badge>{item.quantity}</Badge>
                    </UILabel>
                  </li>
                )
              })}
            </UIList>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export default Facets
