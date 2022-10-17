import React, { useCallback, useState } from 'react'
import size from 'lodash/size'
import Slider from 'components/base/slider/Slider'
import HintIcon from 'components/base/hint/HintIcon'
import Row from 'components/base/row/Row'
import Text from 'components/base/text/Text'
import type { SliderProps } from 'components/base/slider/Slider'
import './slider.scss'

export type SliderCardProps = Partial<SliderProps> & {
  initialValue?: number,
  name?: string,
  onChange?: (name: string, value: number) => void,
  onChangeCommitted?: (name: string, value: number) => void,
  hint?: string,
  title?: string,
  valueModifier?: (value: number) => string,
  disabled?: boolean,
}

const SliderCard = (props: SliderCardProps) => {
  const {
    initialValue = 0,
    name = '',
    onChange,
    onChangeCommitted,
    hint = '',
    title = '',
    valueModifier,
    disabled = false,
    ...other
  } = props

  const [value, setValue] = useState(initialValue)

  const onChangeValue = useCallback(
    (_: Event, value: number) => {
      setValue(value)
      onChange?.(name, value)
    },
    [setValue, onChange, name],
  )

  const onChangeCommittedValue = useCallback(
    (_: Event, value: number) => {
      setValue(value)
      onChangeCommitted?.(name, value)
    },
    [setValue, onChangeCommitted, name],
  )

  return (
    <div className="slider-card">
      <Row vertical="line" className="slider-card__row">
        <Text className="slider-card__title">{title}</Text>
        {size(hint) > 0 && <HintIcon title={hint} size="small" />}
      </Row>
      <Text variant="xxl" className="slider-card__value">
        {valueModifier?.(value) ?? value}
      </Text>
      <Slider
        {...other}
        onChange={onChangeValue}
        onChangeCommitted={onChangeCommittedValue}
        value={value}
        disabled={disabled}
      />
    </div>
  )
}

export default SliderCard
