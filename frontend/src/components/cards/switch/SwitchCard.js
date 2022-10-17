import React, { useCallback, useState } from 'react'
import size from 'lodash/size'
import HintIcon from 'components/base/hint/HintIcon'
import Row from 'components/base/row/Row'
import Text from 'components/base/text/Text'
import Switch from 'components/base/switch/Switch'
import type { SwitchProps } from 'components/base/switch/Switch'
import './switch.scss'

export type SwitchCardProps = Partial<SwitchProps> & {
  title?: string,
  hint?: string,
  name?: string,
  sale?: number,
  initialValue?: boolean,
  onChange?: (name: string, value: number) => void,
  disabled?: boolean,
}

const SwitchCard = (props: SwitchCardProps) => {
  const {
    title = '',
    hint = '',
    name = '',
    sale = 0,
    initialValue = false,
    onChange,
    disabled = false,
    ...other
  } = props

  const [value, setValue] = useState(initialValue)

  const onChangeValue = useCallback(
    (value: boolean) => {
      setValue(value)
      onChange?.(name, value)
    },
    [setValue, onChange, name],
  )

  return (
    <Row horizontal="between" className="switch-card">
      <Row vertical="line">
        <Text type="bold">{title}</Text>
        {size(hint) > 0 && <HintIcon title={hint} size="small" />}
      </Row>
      <Row className="switch-card__row">
        <Text type="bold">{`-${sale}%`}</Text>
        <Switch {...other} onChange={onChangeValue} value={value} disabled={disabled} />
      </Row>
    </Row>
  )
}

export default SwitchCard
