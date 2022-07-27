import { useSession } from '@faststore/sdk'
import { Table, TableBody, TableCell, TableRow } from '@faststore/ui'
import type { HTMLAttributes } from 'react'
import { useRef, useState } from 'react'

import Price from 'src/components/ui/Price'
import { usePriceFormatter } from 'src/sdk/product/useFormattedPrice'

import Icon from '../Icon'
import InputText from '../InputText'
import Link from '../Link'
import styles from './shipping-simulation.module.scss'

interface ShippingSimulationProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

const shippingOptions = [
  {
    carrier: 'Regular',
    estimate: '12 days',
    price: 21,
  },
  {
    carrier: 'Fedex',
    estimate: '12 days',
    price: 23,
  },
  {
    carrier: 'Same day',
    estimate: '1 day',
    price: 89,
  },
  {
    carrier: 'DHL',
    estimate: '1 day',
    price: 100,
  },
]

function ShippingSimulation({
  testId = 'store-shipping-simulation',
  ...otherProps
}: ShippingSimulationProps) {
  const postalCodeInputRef = useRef<HTMLInputElement>(null)
  const { postalCode } = useSession()
  const [postalCodeInput, setPostalCodeInput] = useState(postalCode ?? '')
  const [postalCodeLocation, setPostalCodeLocation] = useState(
    'Mt. Street — Newark, NY'
  )

  const formatter = usePriceFormatter()

  const handleSubmit = () => {
    const value = postalCodeInputRef.current?.value

    // API integration with shipping simulation resolver
    setPostalCodeLocation(`Updated ${value} Location`)
  }

  return (
    <section
      className={styles.fsShippingSimulation}
      data-fs-shipping-simulation
      data-testid={testId}
      {...otherProps}
    >
      <h2 className="text__title-subsection" data-fs-shipping-simulation-title>
        Shipping
      </h2>

      <InputText
        inputRef={postalCodeInputRef}
        actionable
        id="shipping-postal-code"
        label="Zip Code"
        onSubmit={handleSubmit}
        onInput={(e) => setPostalCodeInput(e.currentTarget.value)}
        onClear={() => setPostalCodeInput('')}
        value={postalCodeInput}
      />

      <Link href="/" data-fs-shipping-simulation-link>
        {"I don't know my Postal Code"}
        <Icon name="ArrowSquareOut" width={18} height={18} />
      </Link>

      <h3 data-fs-shipping-simulation-subtitle>Shipping options</h3>
      <p className="text__body" data-fs-shipping-simulation-location>
        {postalCodeLocation}
      </p>

      <Table data-fs-shipping-simulation-table>
        <TableBody>
          {shippingOptions.map((option) => (
            <TableRow
              key={option.carrier}
              data-fs-shipping-simulation-table-row
            >
              <TableCell data-fs-shipping-simulation-table-cell>
                {option.carrier}
              </TableCell>
              <TableCell data-fs-shipping-simulation-table-cell>
                {option.estimate}
              </TableCell>
              <TableCell data-fs-shipping-simulation-table-cell>
                <Price
                  formatter={formatter}
                  value={option.price}
                  SRText="price"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}

export default ShippingSimulation
