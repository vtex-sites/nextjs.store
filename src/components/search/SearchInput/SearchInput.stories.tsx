import { SessionProvider } from '@faststore/sdk'
import { rest } from 'msw'

import { productGridItems, searchTerms } from 'src/../.storybook/mocks'

import Suggestions from '.'
import type { SearchInputProps } from './SearchInput'
import SearchInput from './SearchInput'

const meta = {
  component: Suggestions,
  title: 'Features/SearchSuggestions/SearchInput',
}

const Template = (props: SearchInputProps) => (
  <div
    style={{
      maxWidth: '600px',
      height: '400px',
      margin: '0 auto',
      padding: '0 16px',
      background: 'white',
    }}
  >
    <SessionProvider>
      <SearchInput {...props} />
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
