import { Table, TableBody, TableCell, TableRow } from '@faststore/ui'
import type { HTMLAttributes } from 'react'

import Price from 'src/components/ui/Price'
import { usePriceFormatter } from 'src/sdk/product/useFormattedPrice'

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
    name: 'Regular',
    time: '12 days',
    price: 21,
  },
  {
    name: 'Fedex',
    time: '12 days',
    price: 23,
  },
  {
    name: 'Same day',
    time: '1 day',
    price: 89,
  },
  {
    name: 'DHL',
    time: '1 day',
    price: 100,
  },
]

function ShippingSimulation({
  testId = 'store-shipping-simulation',
  ...otherProps
}: ShippingSimulationProps) {
  const formatter = usePriceFormatter()

  return (
    <section
      className={styles.fsShippingSimulation}
      data-fs-shipping-simulation
      data-testid={testId}
      {...otherProps}
    >
      {/* Shipping */}
      {/* Input */}
      {/* Link */}

      <h3>Shipping options</h3>
      <p>Mt. Street — Newark, NY</p>
      <Table data-fs-shipping-simulation-table>
        <TableBody>
          {shippingOptions.map((option) => (
            <TableRow key={option.name} data-fs-shipping-simulation-table-row>
              <TableCell data-fs-shipping-simulation-table-cell>
                {option.name}
              </TableCell>
              <TableCell data-fs-shipping-simulation-table-cell>
                {option.time}
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
