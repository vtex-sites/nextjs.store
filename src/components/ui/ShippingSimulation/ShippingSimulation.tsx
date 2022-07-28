import { useSession } from '@faststore/sdk'
import { Table, TableBody, TableCell, TableRow } from '@faststore/ui'
import type { ChangeEvent, HTMLAttributes } from 'react'
import { useEffect, useState } from 'react'

import Price from 'src/components/ui/Price'
import { usePriceFormatter } from 'src/sdk/product/useFormattedPrice'

import Icon from '../Icon'
import InputText from '../InputText'
import Link from '../Link'
import styles from './shipping-simulation.module.scss'

type ShippingOptionProps = {
  carrier: string
  estimate: string
  price: number
}

interface ShippingSimulationProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * Array of ShippingOptionProps
   */
  options?: ShippingOptionProps[]
}

// TODO Remove default values after API integration
const defaultShippingOptions = [
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
  options,
  ...otherProps
}: ShippingSimulationProps) {
  const { postalCode: sessionPostalCode } = useSession()

  const [shippingPostalCode, setShippingPostalCode] = useState('')
  const [displayClearButton, setDisplayClearButton] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [shippingOptions, setShippingOptions] = useState<ShippingOptionProps[]>(
    []
  )

  const [postalCodeLocation, setPostalCodeLocation] = useState('')

  useEffect(() => {
    if (!sessionPostalCode || shippingPostalCode) return

    // Use session postal code if there is no shippingPostalCode
    setShippingPostalCode(sessionPostalCode)
    setDisplayClearButton(true)

    // TODO update after API integration
    setShippingOptions(options ?? [])
    setPostalCodeLocation('Mt. Street — Newark, NY')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, sessionPostalCode])

  const formatter = usePriceFormatter()

  const handleSubmit = () => {
    setDisplayClearButton(true)

    try {
      // TODO Change next lines after API integration
      setPostalCodeLocation(`Updated ${shippingPostalCode} location`)
      setShippingOptions(defaultShippingOptions)
    } catch (error) {
      setErrorMessage('You entered an invalid Zip Code')
    }
  }

  const handleOnInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (errorMessage !== '') {
      setErrorMessage('')
    }

    const currentValue = e.currentTarget.value

    setShippingPostalCode(currentValue)
    setDisplayClearButton(false)

    if (!currentValue) {
      setShippingOptions([])
      setPostalCodeLocation('')
    }
  }

  const hasShippingOptions = !!shippingOptions && shippingOptions.length > 0

  return (
    <section
      className={styles.fsShippingSimulation}
      data-fs-shipping-simulation
      data-fs-shipping-simulation-empty={!hasShippingOptions ? 'true' : 'false'}
      data-testid={testId}
      {...otherProps}
    >
      <h2 className="text__title-subsection" data-fs-shipping-simulation-title>
        Shipping
      </h2>

      <InputText
        actionable
        error={errorMessage}
        id="shipping-postal-code"
        label="Zip Code"
        value={shippingPostalCode}
        onInput={handleOnInput}
        onSubmit={handleSubmit}
        onClear={() => {
          setShippingPostalCode('')
          setPostalCodeLocation('')
          setShippingOptions([])
          setDisplayClearButton(false)
        }}
        displayClearButton={displayClearButton}
      />

      <Link href="/" data-fs-shipping-simulation-link>
        {"I don't know my Postal Code"}
        <Icon name="ArrowSquareOut" width={18} height={18} />
      </Link>

      {hasShippingOptions && (
        <>
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
        </>
      )}
    </section>
  )
}

// TODO Remove next lines after API integration
ShippingSimulation.defaultProps = {
  options: defaultShippingOptions,
}

export default ShippingSimulation
