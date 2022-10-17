import React from 'react'
import { Slider as BaseSlider } from '@mui/material'

export type SliderProps = {
  defaultValue?: number,
  disabled?: boolean,
  step?: number,
  max?: number,
  min?: number,
  value?: number,
  onChange?: (_: Event, value: number) => void,
  onChangeCommitted?: (_: Event, value: number) => void,
}

const Slider = (props: SliderProps) => {
  const {
    defaultValue = 0,
    disabled = false,
    step = 1,
    min = 0,
    max,
    value,
    onChange,
    onChangeCommitted,
  } = props

  return (
    <BaseSlider
      defaultValue={defaultValue}
      disabled={disabled}
      step={step}
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      onChangeCommitted={onChangeCommitted}
      color="primary"
    />
  )
}

export default Slider
