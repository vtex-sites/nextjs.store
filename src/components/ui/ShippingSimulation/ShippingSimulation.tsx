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

type ShippingSimulationInfoProps = {
  location?: string
  options?: ShippingOptionProps[]
}

// TODO Remove Mocked data after API integration
const mockShippingOptions: ShippingOptionProps[] = [
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

const mockShippingSimulation: ShippingSimulationInfoProps = {
  location: 'Street Default — Newark, NY',
  options: mockShippingOptions,
}

const createEmptySimulation = () => ({
  location: '',
  options: [],
})

interface ShippingSimulationProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

function ShippingSimulation({
  testId = 'store-shipping-simulation',
  ...otherProps
}: ShippingSimulationProps) {
  const { postalCode: sessionPostalCode } = useSession()

  const [simulation, setSimulation] = useState<ShippingSimulationInfoProps>(
    createEmptySimulation()
  )

  const { location: shippingLocation, options: shippingOptions } = simulation

  const [shippingPostalCode, setShippingPostalCode] = useState('')
  const [displayClearButton, setDisplayClearButton] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!sessionPostalCode || shippingPostalCode) return

    // Use session postal code if there is no shippingPostalCode
    setShippingPostalCode(sessionPostalCode)
    setDisplayClearButton(true)

    // TODO update after API integration
    setSimulation({
      location: mockShippingSimulation?.location,
      options: mockShippingSimulation?.options ?? [],
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionPostalCode])

  const formatter = usePriceFormatter()

  const handleSubmit = () => {
    setDisplayClearButton(true)

    try {
      // TODO Change next lines after API integration
      setSimulation({
        location: `Street from ${shippingPostalCode} Postal Code.`,
        options: mockShippingOptions ?? [],
      })
    } catch (error) {
      setErrorMessage('You entered an invalid Postal Code')
    }
  }

  const handleOnInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (errorMessage) {
      setErrorMessage('')
    }

    const currentValue = e.currentTarget.value

    setShippingPostalCode(currentValue)
    setDisplayClearButton(false)

    if (!currentValue) {
      setSimulation(createEmptySimulation())
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
        label="Postal Code"
        value={shippingPostalCode}
        onInput={handleOnInput}
        onSubmit={handleSubmit}
        onClear={() => {
          setShippingPostalCode('')
          setDisplayClearButton(false)
          setSimulation(createEmptySimulation())
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
            {shippingLocation}
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

export default ShippingSimulation
