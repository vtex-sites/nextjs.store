import { SessionProvider } from '@faststore/sdk'
import { rest } from 'msw'

import { productGridItems, searchTerms } from 'src/../.storybook/mocks'
import { SearchInputProvider } from 'src/sdk/search/useSearchInput'

import SearchDropdown from '.'
import type { SuggestionsProps } from '../Suggestions'

const meta = {
  component: SearchDropdown,
  title: 'Features/SearchSuggestions/SearchDropdown',
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
        <SearchDropdown {...props} />
      </SearchInputProvider>
    </SessionProvider>
  </div>
)

export const Default = Template.bind({})

const products = productGridItems.map((item) => item.node)

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

        if (operationName === 'SearchSuggestionsQuery') {
          return res(
            ctx.json({
              data: {
                search: {
                  suggestions: {
                    terms: searchTerms,
                    products,
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
