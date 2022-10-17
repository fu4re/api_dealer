import React, { useCallback } from 'react'
import padStart from 'lodash/padStart'
import moment from 'moment'
import Popover, { PopoverProps } from '@material-ui/core/Popover/Popover'
import PickerList from 'components/inputs/pickers/PickerList'
import { DATE_FORMATS } from 'constants/date-time'
import { stopPropagationEvent } from 'utils/common'
import './time.scss'

export const TIME_PICKER_FORMAT = DATE_FORMATS.time

export const HOURS = 'hours'
export const MINUTES = 'minutes'

export type SelectId = HOURS | MINUTES

export type TimePickerProps = {
  value: string,
  visible: boolean,
  onChange: (data: string) => void,
} & $Shape<PopoverProps>

export type PickerSelectParamsType = {
  id: SelectId,
  label: string,
  count: number,
}

const TimePicker = (props: TimePickerProps) => {
  const {
    value,
    visible,
    anchorEl,
    onClose,
    anchorOrigin = { vertical: 'bottom', horizontal: 'right' },
    transformOrigin = { vertical: 'top', horizontal: 'right' },
    onChange,
  } = props

  const getSelectIndexOptions = useCallback((count: number, padLength: number = 0) => {
    return Array.from(Array(count).keys()).map((v) => ({
      value: v,
      title: padLength ? padStart(v, padLength, '0') : v + 1,
    }))
  }, [])

  const momentValue = moment(value, TIME_PICKER_FORMAT)

  const getSubValue = useCallback(
    (id: SelectId) => (momentValue.isValid() ? momentValue.get(id) : ''),
    [momentValue],
  )

  const onClickPicker = useCallback(
    (value: number, id: SelectId) => {
      const resultMoment = momentValue.isValid() ? momentValue : moment()
      const resultValue = resultMoment.set(id, value).format(TIME_PICKER_FORMAT)

      onChange(resultValue)
    },
    [onChange, momentValue],
  )

  const renderSelect = useCallback(
    (params: PickerSelectParamsType) => {
      const { id, label, count } = params

      const localValue = getSubValue(id)
      const items = getSelectIndexOptions(count, 2)
      const _onClickPicker = (value: number) => onClickPicker(value, id)

      return (
        <PickerList
          items={items}
          label={label}
          value={localValue}
          onClick={_onClickPicker}
        />
      )
    },
    [onClickPicker, getSubValue, getSelectIndexOptions],
  )

  return (
    <Popover
      classes={{ paper: 'time-picker_paper' }}
      open={visible}
      anchorEl={anchorEl.current}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      onBackdropClick={onClose}
    >
      <div onClick={stopPropagationEvent} className="time-picker__container">
        {renderSelect({ id: HOURS, label: 'Часы', count: 24 })}
        {renderSelect({ id: MINUTES, label: 'Минуты', count: 60 })}
      </div>
    </Popover>
  )
}

export default TimePicker
