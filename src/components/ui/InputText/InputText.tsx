import { Input as UIInput, Label as UILabel } from '@faststore/ui'
import type { MutableRefObject } from 'react'
import type { InputProps } from '@faststore/ui'

import Button from 'src/components/ui/Button'
import ButtonIcon from 'src/components/ui/Button/ButtonIcon'
import Icon from 'src/components/ui/Icon'

type DefaultProps = {
  /**
   * ID to identify input and corresponding label.
   */
  id: string
  /**
   * The text displayed to identify input text.
   */
  label: string
  /**
   * The error message is displayed when an error occurs.
   */
  error?: string
  /**
   * Component's ref.
   */
  inputRef?: MutableRefObject<HTMLInputElement | null>
  /**
   * Specifies that the whole input component should be disabled.
   */
  disabled?: boolean
}

type ActionableInputText =
  | {
      /**
       * Adds a Button to the component.
       */
      actionable: true
      /**
       * Callback function when button is clicked.
       */
      onSubmit: () => void
      /**
       * Callback function when clear button is clicked.
       */
      onClear: () => void
      /**
       * The text displayed on the Button. Suggestion: maximum 9 characters.
       */
      buttonActionText?: string
    }
  | {
      actionable?: false
      onSubmit?: never
      onClear?: never
      buttonActionText?: string
    }

export type InputTextProps = DefaultProps &
  Omit<InputProps, 'disabled'> &
  ActionableInputText

const InputText = ({
  id,
  label,
  type = 'text',
  error,
  actionable,
  buttonActionText = 'Apply',
  onSubmit,
  onClear,
  placeholder = ' ', // initializes with an empty space to style float label using `placeholder-shown`
  inputRef,
  disabled,
  ...otherProps
}: InputTextProps) => {
  return (
    <div
      data-fs-input-text
      data-fs-input-text-error={!!error}
      data-fs-input-text-actionable={actionable}
    >
      <UIInput
        id={id}
        type={type}
        ref={inputRef}
        disabled={disabled}
        placeholder={placeholder}
        {...otherProps}
      />
      <UILabel htmlFor={id}>{label}</UILabel>

      {actionable &&
        !disabled &&
        (error ? (
          <ButtonIcon
            data-fs-button-size="small"
            aria-label="Clear Field"
            icon={<Icon name="XCircle" width={20} height={20} />}
            onClick={() => {
              onClear?.()
              inputRef?.current?.focus()
            }}
          />
        ) : (
          <Button variant="tertiary" size="small" onClick={onSubmit}>
            {buttonActionText}
          </Button>
        ))}
      {error && !disabled && <span data-fs-input-text-message>{error}</span>}
    </div>
  )
}

export default InputText
