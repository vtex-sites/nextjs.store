import { SessionProvider } from '@faststore/sdk'
import { rest } from 'msw'

import { SearchInputProvider } from 'src/sdk/search/useSearchInput'
import { searchTerms } from 'src/../.storybook/mocks'

import type { SuggestionsTopSearchProps } from './SuggestionsTopSearch'
import SuggestionsTopSearch from './SuggestionsTopSearch'

const meta = {
  component: SuggestionsTopSearch,
  title: 'Features/SearchSuggestions/SuggestionsTopSearch',
}

const Template = (props: SuggestionsTopSearchProps) => (
  <div
    style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '0 16px',
      background: 'white',
    }}
  >
    <SessionProvider initialState={{}}>
      <SearchInputProvider>
        <SuggestionsTopSearch {...props} />
      </SearchInputProvider>
    </SessionProvider>
  </div>
)

export const Default = Template.bind({})

Default.parameters = {
  backgrounds: { default: 'dark' },
  msw: {
    handlers: [
      rest.get('/api/graphql', (req, res, ctx) => {
        const {
          url: { searchParams },
        } = req

        const operationName = searchParams.get('operationName')

        if (operationName === 'TopSearchSuggestionsQuery') {
          return res(
            ctx.json({
              data: {
                search: {
                  suggestions: {
                    terms: searchTerms,
                  },
                },
              },
            })
          )
        }

        return res(ctx.status(400))
      }),
    ],
  },
}

export default meta
