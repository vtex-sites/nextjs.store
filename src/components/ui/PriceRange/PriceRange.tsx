import { useState, useRef } from 'react'
import { PriceRange as UIPriceRange } from '@faststore/ui'
import type { PriceRangeProps } from '@faststore/ui'

import { usePriceFormatter } from 'src/sdk/product/useFormattedPrice'

import styles from './price-range.module.scss'
import InputText from '../InputText'

type Props = Omit<PriceRangeProps, 'formatter'>

function PriceRange({ min, max, ...otherProps }: Props) {
  const formatter = usePriceFormatter()
  const inputMinRef = useRef<HTMLInputElement>(null)
  const inputMaxRef = useRef<HTMLInputElement>(null)

  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({
    min: String(min.selected),
    max: String(max.selected),
  })

  function onChangePriceRange(value: {
    min: string | number
    max: string | number
  }) {
    setPriceRange({ min: String(value.min), max: String(value.max) })

    if (inputMinRef.current?.value) {
      inputMinRef.current.value = String(value.min)
    }

    if (inputMaxRef.current?.value) {
      inputMaxRef.current.value = String(value.max)
    }
  }

  return (
    <>
      <div className={styles.fsPriceRange} data-fs-price-range-rule>
        <span>{min.absolute}</span>
        <span>{max.absolute}</span>
      </div>
      <UIPriceRange
        min={min}
        max={max}
        data-fs-price-range
        formatter={formatter}
        className={styles.fsPriceRange}
        onChange={(value) => onChangePriceRange(value)}
        {...otherProps}
      />
      <div className={styles.fsPriceRange} data-fs-price-range-inputs>
        <InputText
          id="price-range-min"
          value={priceRange.min}
          label="Min"
          inputRef={inputMinRef}
          onChange={(e) =>
            setPriceRange({ ...priceRange, min: e.target.value })
          }
        />
        <InputText
          id="price-range-max"
          value={priceRange.max}
          label="Max"
          inputRef={inputMaxRef}
          onChange={(e) =>
            setPriceRange({ ...priceRange, max: e.target.value })
          }
        />
      </div>
    </>
  )
}

export default PriceRange
