import { SessionProvider } from '@faststore/sdk'

import Suggestions from '.'
import type { SearchInputProps } from './SearchInput'
import SearchInput from './SearchInput'

const meta = {
  component: Suggestions,
  title: 'Features/Search/SearchInput',
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

Default.parameters = {
  backgrounds: { default: 'dark' },
}

export default meta
