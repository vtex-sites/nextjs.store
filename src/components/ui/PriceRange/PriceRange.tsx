import { useState, useRef } from 'react'
import { PriceRange as UIPriceRange } from '@faststore/ui'
import type { PriceRangeProps } from '@faststore/ui'

import { usePriceFormatter } from 'src/sdk/product/useFormattedPrice'

import styles from './price-range.module.scss'
import InputText from '../InputText'

type Props = Omit<PriceRangeProps, 'formatter'>

function PriceRange({ min, max, ...otherProps }: Props) {
  const formatter = usePriceFormatter({ decimals: false })
  const inputMinRef = useRef<HTMLInputElement>(null)
  const inputMaxRef = useRef<HTMLInputElement>(null)
  const priceRangeRef = useRef<{
    setPriceRangeValues: (values: { min: number; max: number }) => void
  }>()

  const [inputMinError, setInputMinError] = useState<string>()
  const [inputMaxError, setInputMaxError] = useState<string>()
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

  function onChangeInputMin(value: string) {
    setInputMinError(undefined)

    if (Number(value) > priceRange.max) {
      setInputMinError(`Min price can't be greater than max`)
    }

    setPriceRange({ ...priceRange, min: Number(value) })
    priceRangeRef.current?.setPriceRangeValues({
      ...priceRange,
      min: Number(value),
    })
  }

  function onChangeInputMax(value: string) {
    setInputMaxError(undefined)

    if (Number(value) < priceRange.min) {
      setInputMaxError(`Max price can't be smaller than min`)
    }

    setPriceRange({ ...priceRange, max: Number(value) })
    priceRangeRef.current?.setPriceRangeValues({
      ...priceRange,
      max: Number(value),
    })
  }

  return (
    <div className={styles.fsPriceRange} data-fs-price-range>
      <div data-fs-price-range-absolute-values>
        <span>{min.absolute}</span>
        <span>{max.absolute}</span>
      </div>
      <UIPriceRange
        ref={priceRangeRef}
        min={min}
        max={max}
        formatter={formatter}
        onChange={(value) => onChangePriceRange(value)}
        {...otherProps}
      />
      <div data-fs-price-range-inputs>
        <InputText
          id="price-range-min"
          label="Min"
          type="number"
          inputMode="numeric"
          min={min.absolute}
          max={priceRange.max}
          error={inputMinError}
          value={priceRange.min}
          inputRef={inputMinRef}
          onChange={(e) => onChangeInputMin(e.target.value)}
        />
        <InputText
          id="price-range-max"
          label="Max"
          type="number"
          inputMode="numeric"
          min={priceRange.min}
          max={max.absolute}
          error={inputMaxError}
          value={priceRange.max}
          inputRef={inputMaxRef}
          onChange={(e) => onChangeInputMax(e.target.value)}
        />
      </div>
    </div>
  )
}

export default PriceRange
