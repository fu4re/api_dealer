import React from 'react'
import classNames from 'classnames'
import RadioInput from 'components/radio/RadioInput'
import type { RadioInputCallbackData } from 'components/radio/RadioInput'

export type RadioGroupCallbackData = RadioInputCallbackData & {
  item: Record<string, any>,
}

export type RadioType = {
  id: string | number,
  label: string,
  tooltip: string,
}

type RadioGroupProps = {
  className?: string,
  radios: Array<RadioType>,
  size: 'small' | 'base',
  activeId: string | number,
  isInline?: boolean,
  onChange: (data: RadioGroupCallbackData) => void,
  isDisabled?: boolean,
}

const RadioGroup = (props: RadioGroupProps) => {
  const {
    className = '',
    radios,
    activeId,
    isInline = false,
    onChange,
    size = 'base',
    isDisabled = false,
  } = props

  return (
    <div
      className={classNames('radio-group', className, {
        'radio-group--inline': isInline,
      })}
    >
      {radios.map((radio) => {
        const { id, label, tooltip, className } = radio

        return (
          <RadioInput
            id={id}
            key={`RadioInput_${id}`}
            className={classNames(className, `radio-input--${size}`)}
            value={id === activeId}
            label={label}
            tooltip={tooltip}
            isDisabled={isDisabled}
            onChange={(data: RadioInputCallbackData) => {
              onChange({ ...data, item: radio })
            }}
          />
        )
      })}
    </div>
  )
}

export default RadioGroup
