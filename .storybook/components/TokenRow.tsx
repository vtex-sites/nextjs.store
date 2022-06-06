import React, { ReactNode } from 'react'
import { Code } from '@storybook/components'

type TokenRowProps = {
  token: string
  value: string
  isColor?: boolean
  valueGlobal?: string
}

const TokenRow = ({
  token,
  value,
  valueGlobal,
  isColor = false,
}: TokenRowProps) => {
  return (
    <tr>
      <td>
        <Code>{token}</Code>
      </td>
      <td>
        {isColor && (
          <div style={{ backgroundColor: valueGlobal ? valueGlobal : value }} />
        )}
        <Code>{value}</Code>
      </td>
    </tr>
  )
}

export default TokenRow
