import React, { useCallback } from 'react'
import classNames from 'classnames'
import Text from 'components/base/text/Text'
import Row from 'components/base/row/Row'
import HintIcon from 'components/base/hint/HintIcon'
import { stopPropagationEvent } from 'utils/common'
import './radio.scss'

export type RadioInputCallbackData = {
  id: any,
  value: boolean,
  event: Object,
}

export type RadioInputProps = {
  id?: string | number,
  value: boolean,
  label?: string,
  tooltip?: string,
  className?: string,
  onChange: (data: RadioInputCallbackData) => void,
  isDisabled?: boolean,
}

export type RadioItemType = {
  index: number,
  hint: string,
  value: boolean,
  readonly: boolean,
}

const RadioInput = (props: RadioInputProps) => {
  const {
    value,
    label = null,
    tooltip = '',
    className = '',
    isDisabled = false,
    id = null,
    onChange,
  } = props

  const _onChange = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      stopPropagationEvent(event)
      onChange?.({ id, value: !value, event })
    },
    [id, value, onChange],
  )

  return (
    <Row
      className={classNames('radio', className, { disabled: isDisabled })}
      onClick={_onChange}
    >
      <input type="radio" checked={value} onChange={() => {}} />
      {label && <Text Component="label">{label}</Text>}
      {Boolean(tooltip) && <HintIcon title={tooltip} />}
    </Row>
  )
}

export default RadioInput
