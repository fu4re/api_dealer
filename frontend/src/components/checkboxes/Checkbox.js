import React, { ReactNode, useMemo, useCallback, Ref, forwardRef } from 'react'
import lodashSize from 'lodash/size'
import classNames from 'classnames'
import Text from 'components/base/text/Text'
import SvgIcon from 'components/base/icon/SvgIcon'
import { ICONS } from 'assets/icons/icons'
import { stopPropagationEvent } from 'utils/common'
import './checkbox.scss'

export type CheckboxCallbackData = {
  id: string | number,
  value: boolean,
  event: Record<string, any>,
}

export const CHECKED_PARTIALLY = 'partially'

export type CheckboxProps = {
  className?: string,
  size?: 'small' | 'large',
  type?: 'base' | 'alt',
  disabled?: boolean,
  value?: boolean | CHECKED_PARTIALLY,
  id?: string | number,
  label?: string,
  renderAfterLabel?: () => ReactNode,
  renderAtEnd?: () => ReactNode,
  onChange?: (data: CheckboxCallbackData) => void,
  name?: string,
  noWrap?: boolean,
}

const Checkbox = (props: CheckboxProps, ref: Ref) => {
  const {
    className = '',
    size = 'large',
    type = 'base',
    disabled = false,
    value = false,
    id,
    label,
    renderAfterLabel,
    renderAtEnd,
    onChange,
    name = '',
    noWrap = false,
  } = props

  const isCheckedPartially = useMemo(() => value === CHECKED_PARTIALLY, [value])

  const icon = useMemo(() => {
    return isCheckedPartially || value ? (
      <SvgIcon
        Icon={isCheckedPartially ? ICONS.minus : ICONS.check}
        className="checkbox__icon"
      />
    ) : null
  }, [isCheckedPartially, value])

  const stateClassName = useMemo(() => {
    return isCheckedPartially ? 'partially' : value ? 'checked' : 'unchecked'
  }, [isCheckedPartially, value])

  const onClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      stopPropagationEvent(event)

      const newData = { value: isCheckedPartially ? true : !value, id, event, name }
      !disabled && onChange?.(newData)
    },
    [id, value, disabled, onChange, isCheckedPartially, name],
  )

  return (
    <div
      ref={ref}
      onClick={onClick}
      name={name}
      id={id}
      className={classNames(
        'checkbox',
        className,
        disabled ? 'disabled' : 'enabled',
        stateClassName,
        size,
        { 'checkbox--alt': type === 'alt', 'no-wrap': noWrap },
      )}
    >
      <div className="checkbox__box" name={name} id={id}>
        {icon}
      </div>
      {lodashSize(label) > 0 && (
        <Text className="checkbox__label" name={name} id={id}>
          {label}
          {renderAfterLabel?.()}
        </Text>
      )}
      {renderAtEnd?.()}
    </div>
  )
}

export default forwardRef(Checkbox)
