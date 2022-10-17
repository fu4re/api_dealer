import React, { useMemo } from 'react'
import Popover, { PopoverProps } from '@material-ui/core/Popover/Popover'
import PickerList from 'components/inputs/pickers/PickerList'
import { stopPropagationEvent } from 'utils/common'
import './year.scss'

export type YearPickerProps = {
  value: number,
  visible: boolean,
  onChange: (data: number) => void,
} & $Shape<PopoverProps>

const YearPicker = (props: YearPickerProps) => {
  const {
    value,
    visible,
    anchorEl,
    onClose,
    anchorOrigin = { vertical: 'bottom', horizontal: 'right' },
    transformOrigin = { vertical: 'top', horizontal: 'right' },
    onChange,
  } = props

  const items = useMemo(() => {
    const start = 2000
    const count = 100

    return Array.from(Array(count).keys()).map((v) => ({
      value: start + v,
      title: start + v,
    }))
  }, [])

  return (
    <Popover
      classes={{ paper: 'year-picker_paper' }}
      open={visible}
      anchorEl={anchorEl.current}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      onBackdropClick={onClose}
    >
      <div onClick={stopPropagationEvent} className="year-picker__container">
        <PickerList
          value={parseInt(value) || null}
          defaultScrollValue={new Date().getFullYear()}
          items={items}
          onClick={onChange}
          label="Год"
        />
      </div>
    </Popover>
  )
}

export default YearPicker
