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
  const priceRangeRef = useRef<{
    setEdgeValues: (values: { min: number; max: number }) => void
  }>()

  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: min.selected,
    max: max.selected,
  })

  function onChangePriceRange(value: { min: number; max: number }) {
    setPriceRange({ min: value.min, max: value.max })

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
        ref={priceRangeRef}
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
          type="number"
          value={priceRange.min}
          label="Min"
          inputRef={inputMinRef}
          onChange={(e) => {
            setPriceRange({ ...priceRange, min: Number(e.target.value) })
            priceRangeRef.current?.setEdgeValues({
              ...priceRange,
              min: Number(e.target.value),
            })
          }}
        />
        <InputText
          id="price-range-max"
          type="number"
          value={priceRange.max}
          label="Max"
          inputRef={inputMaxRef}
          onChange={(e) => {
            setPriceRange({ ...priceRange, max: Number(e.target.value) })
            priceRangeRef.current?.setEdgeValues({
              ...priceRange,
              max: Number(e.target.value),
            })
          }}
        />
      </div>
    </>
  )
}

export default PriceRange
