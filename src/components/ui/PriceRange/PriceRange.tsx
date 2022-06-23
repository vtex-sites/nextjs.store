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
  const [minValue, setMinValue] = useState<string | number>(min.selected)
  const [maxValue, setMaxValue] = useState<string | number>(max.selected)

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
        className={styles.fsPriceRange}
        formatter={formatter}
        onChange={(value) => {
          setMinValue(value.min)
          if (inputMinRef?.current?.value) {
            inputMinRef.current.value = String(value.min)
          }

          setMaxValue(value.max)
        }}
        {...otherProps}
      />
      <div className={styles.fsPriceRange} data-fs-price-range-inputs>
        <InputText
          id="price-range-min"
          value={minValue}
          label="Min"
          inputRef={inputMinRef}
          onChange={(e) => {
            setMinValue(e.target.value)
          }}
        />
        <InputText
          id="price-range-max"
          value={maxValue}
          label="Max"
          inputRef={inputMaxRef}
          // onChange={(e) => setMaxValue(e.target.value)}
        />
      </div>
    </>
  )
}

export default PriceRange
