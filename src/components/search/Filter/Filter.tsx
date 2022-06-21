import { useSearch } from '@faststore/sdk'
import { gql } from '@vtex/graphql-utils'

import type { Filter_FacetsFragment } from '@generated/graphql'
import { useUI } from 'src/sdk/ui/Provider'

import Facets from './Facets'
import FilterSlider from './FilterSlider'
import { useFilter } from './useFilter'

interface Props {
  /**
   * The array that represents the details of every facet.
   */
  facets: Filter_FacetsFragment[]
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

function Filter({ facets: allFacets, testId = 'store-filter' }: Props) {
  const filter = useFilter(allFacets)
  const { toggleFacet } = useSearch()
  const { filter: displayFilter } = useUI()
  const { facets, expanded, dispatch } = filter

  return (
    <>
      <div className="hidden-mobile">
        <Facets
          facets={facets}
          testId={`desktop-${testId}`}
          indicesExpanded={expanded}
          onFacetChange={toggleFacet}
          onAccordionChange={(index) =>
            dispatch({ type: 'toggleExpanded', payload: index })
          }
        />
      </div>

      {displayFilter && <FilterSlider {...filter} testId={testId} />}
    </>
  )
}

export const fragment = gql`
  fragment Filter_facets on StoreFacet {
    key
    label
    type
    values {
      label
      value
      selected
      quantity
    }
  }
`

export default Filter
