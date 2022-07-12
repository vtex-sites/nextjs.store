import { SessionProvider } from '@faststore/sdk'

import { SearchInputProvider } from 'src/sdk/search/useSearchInput'
import { productGridItems, searchTerms } from 'src/../.storybook/mocks'

import Suggestions from '.'
import type { SuggestionsProps } from '.'

const meta = {
  component: Suggestions,
  title: 'Features/SearchSuggestions/Suggestions',
}

const Template = (props: SuggestionsProps) => (
  <div
    style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '0 16px',
      background: 'white',
    }}
  >
    <SessionProvider>
      <SearchInputProvider>
        <Suggestions {...props} />
      </SearchInputProvider>
    </SessionProvider>
  </div>
)

export const Default = Template.bind({})

const products = productGridItems.map((item) => item.node)

Default.args = {
  term: 'Ste',
  terms: searchTerms,
  products,
}

Default.parameters = {
  backgrounds: { default: 'dark' },
}

export default meta
