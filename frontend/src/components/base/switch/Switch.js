import React, { useCallback } from 'react'
import { Switch as BaseSwitch } from '@mui/material'

export type SwitchProps = {
  defaultValue?: number,
  disabled?: boolean,
  value?: number,
  onChange?: (value: boolean) => void,
}

const Switch = (props: SwitchProps) => {
  const { defaultValue = false, disabled = false, value = false, onChange } = props

  const _onChange = useCallback(
    ({ target }: Event) => onChange?.(target.checked),
    [onChange],
  )

  return (
    <BaseSwitch
      checked={value}
      defaultChecked={defaultValue}
      onChange={_onChange}
      disabled={disabled}
      focusVisibleClassName=".Mui-focusVisible"
      color="primary"
      disableRipple
    />
  )
}

export default Switch
