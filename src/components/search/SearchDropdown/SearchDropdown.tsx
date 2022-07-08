import type { SuggestionsProps } from 'src/components/search/Suggestions'
import UISuggestions from 'src/components/search/Suggestions'
import useSuggestions from 'src/sdk/search/useSuggestions'

import { SearchHistory } from '../History'
import { SuggestionsTopSearch } from '../SuggestionsTopSearch'

function SearchDropdown({ term = '', ...otherProps }: SuggestionsProps) {
  const { terms, products, isLoading } = useSuggestions(term)

  if (term.length === 0 && !isLoading) {
    return (
      <>
        <SearchHistory />
        <SuggestionsTopSearch />
      </>
    )
  }

  if (isLoading) {
    return <p data-fs-search-input-loading-text>Loading...</p>
  }

  if (terms.length === 0 && products.length === 0) {
    return null
  }

  return (
    <UISuggestions
      term={term}
      terms={terms}
      products={products}
      {...otherProps}
    />
  )
}

export default SearchDropdown
