import React, { ReactNode } from 'react'
import map from 'lodash/map'
import Row from 'components/base/row/Row'
import Checkbox from 'components/checkboxes/Checkbox'
import type { CheckboxCallbackData } from 'components/checkboxes/Checkbox'
import './checkbox.scss'

export type MultiCheckboxType = {
  value?: string,
  label?: string,
  disabled?: boolean,
}

export type MultiCheckboxProps = {
  values: Array<MultiCheckboxType>,
  size?: 'small' | 'large',
  onChange?: (data: CheckboxCallbackData) => void,
  position?: 'horizontal' | 'vertical',
  isDisabled?: boolean,
  renderAtEnd?: () => ReactNode,
  noWrap?: boolean,
}

const MultiCheckbox = (props: MultiCheckboxProps) => {
  const {
    size,
    values,
    onChange,
    position,
    isDisabled = false,
    renderAtEnd,
    noWrap = false,
  } = props

  const Component = position === 'horizontal' ? Row : 'div'

  return (
    <Component className="checkbox__container">
      {map(
        values,
        ({ id, value = false, label, disabled = false }: MultiCheckboxType) => (
          <Checkbox
            key={id}
            size={size}
            label={label}
            value={value}
            disabled={disabled || isDisabled}
            onChange={onChange}
            id={id}
            className="multi"
            noWrap={noWrap}
          />
        ),
      )}
      {renderAtEnd?.()}
    </Component>
  )
}

export default MultiCheckbox
