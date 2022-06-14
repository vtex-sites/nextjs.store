import { useSearch } from '@faststore/sdk'
import { useEffect, useMemo, useReducer } from 'react'
import type { IStoreSelectedFacet } from '@faststore/api'

import type { Filter_FacetsFragment } from '@generated/graphql'

interface State {
  expanded: Set<number>
  selected: IStoreSelectedFacet[]
}

type Action =
  | {
      type: 'toggleExpanded'
      payload: number
    }
  | {
      type: 'selectFacets'
      payload: IStoreSelectedFacet[]
    }
  | {
      type: 'toggleFacet'
      payload: IStoreSelectedFacet
    }
  | {
      type: 'setFacet'
      payload: { facet: IStoreSelectedFacet; unique?: boolean }
    }

const reducer = (state: State, action: Action) => {
  const { expanded, selected } = state
  const { type, payload } = action

  switch (type) {
    case 'toggleExpanded': {
      if (expanded.has(payload)) {
        expanded.delete(payload)
      } else {
        expanded.add(payload)
      }

      return {
        ...state,
        expanded: new Set(expanded),
      }
    }

    case 'selectFacets': {
      if (payload !== selected) {
        return {
          ...state,
          selected: payload,
        }
      }

      break
    }

    case 'toggleFacet': {
      const index = state.selected.findIndex(
        (facet) => facet.key === payload.key && facet.value === payload.value
      )

      if (index > -1) {
        return {
          ...state,
          selected: state.selected.filter((_, idx) => idx !== index),
        }
      }

      return {
        ...state,
        selected: [...state.selected, payload],
      }
    }

    case 'setFacet': {
      const { facet, unique } = payload
      const index = state.selected.findIndex((f) =>
        unique
          ? f.key === facet.key
          : f.key === facet.key && f.value === facet.value
      )

      if (index > -1) {
        return {
          ...state,
          selected: state.selected.map((f, idx) => (idx !== index ? f : facet)),
        }
      }

      return {
        ...state,
        selected: [...state.selected, facet],
      }
    }

    default:
      throw new Error(`Action ${type} not implemented`)
  }

  return state
}

export const useFilter = (allFacets: Filter_FacetsFragment[]) => {
  const {
    state: { selectedFacets },
  } = useSearch()

  const [{ selected, expanded }, dispatch] = useReducer(reducer, null, () => ({
    expanded: new Set([]),
    selected: selectedFacets,
  }))

  const selectedMap = useMemo(
    () =>
      selected.reduce((acc, facet) => {
        if (!acc.has(facet.key)) {
          acc.set(facet.key, new Map())
        }

        acc.get(facet.key)?.set(facet.value, facet)

        return acc
      }, new Map() as Map<string, Map<string, IStoreSelectedFacet>>),
    [selected]
  )

  const facets = useMemo(
    () =>
      allFacets.map((facet) => {
        if (facet.__typename === 'StoreFacetBoolean') {
          return {
            ...facet,
            values: facet.values.map(({ value, ...rest }) => ({
              ...rest,
              value,
              selected: Boolean(selectedMap.get(facet.key)?.has(value)),
            })),
          }
        }

        return facet
      }),
    [allFacets, selectedMap]
  )

  useEffect(() => {
    dispatch({
      type: 'selectFacets',
      payload: selectedFacets,
    })
  }, [selectedFacets])

  return { facets, selected, expanded, dispatch }
}
