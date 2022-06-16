import { useSearch } from '@faststore/sdk'

import type { Filter_FacetsFragment } from '@generated/graphql'
import Button, { ButtonIcon } from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import SlideOver from 'src/components/ui/SlideOver'
import { useUI } from 'src/sdk/ui/Provider'
import { useFadeEffect } from 'src/sdk/ui/useFadeEffect'

import Facets from './Facets'
import styles from './filter-slider.module.scss'
import type { useFilter } from './useFilter'

interface Props {
  facets: Filter_FacetsFragment[]
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

function FilterSlider({
  facets,
  testId,
  dispatch,
  expanded,
  selected,
}: Props & ReturnType<typeof useFilter>) {
  const { closeFilter } = useUI()
  const { fade, fadeOut } = useFadeEffect()

  const {
    setFacets,
    state: { selectedFacets },
  } = useSearch()

  return (
    <SlideOver
      isOpen
      fade={fade}
      onDismiss={fadeOut}
      size="partial"
      direction="rightSide"
      className={styles.fsFilterSlider}
      onTransitionEnd={() => fade === 'out' && closeFilter()}
    >
      <div data-fs-filter-slider-body>
        <header data-fs-filter-slider-header>
          <h2 className="text__lead">Filters</h2>
          <ButtonIcon
            aria-label="Close Filters"
            icon={<Icon name="X" width={32} height={32} />}
            onClick={() => {
              dispatch({
                type: 'selectFacets',
                payload: selectedFacets,
              })

              fadeOut()
            }}
          />
        </header>
        <Facets
          facets={facets}
          testId={`mobile-${testId}`}
          indicesExpanded={expanded}
          onFacetChange={(facet) =>
            dispatch({ type: 'toggleFacet', payload: facet })
          }
          onAccordionChange={(index) =>
            dispatch({ type: 'toggleExpanded', payload: index })
          }
        />
      </div>
      <footer data-fs-filter-slider-footer>
        <Button
          variant="secondary"
          onClick={() => dispatch({ type: 'selectFacets', payload: [] })}
        >
          Clear All
        </Button>
        <Button
          variant="primary"
          data-testid="filter-slider-button-apply"
          onClick={() => {
            setFacets(selected)
            fadeOut()
          }}
        >
          Apply
        </Button>
      </footer>
    </SlideOver>
  )
}

export default FilterSlider
