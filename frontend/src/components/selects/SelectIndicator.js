import React from 'react'
import classNames from 'classnames'
import SvgIcon from 'components/base/icon/SvgIcon'
import { ICONS } from 'assets/icons/icons'
import type { SvgIconType } from 'components/base/icon/SvgIcon'
import './select-indicator.scss'

export type SelectIndicatorProps = {
  className?: string,
  isActive?: boolean,
  onClick?: () => void,
  Icon?: SvgIconType,
  isClickable?: boolean,
}

const SelectIndicator = (props: SelectIndicatorProps) => {
  const {
    className = '',
    isActive = false,
    onClick,
    Icon = ICONS.chevronDown,
    isClickable = false,
  } = props

  return (
    <SvgIcon
      className={classNames('select-indicator', className, {
        'select-indicator--active': isActive,
        'select-indicator--clickable': isClickable || Boolean(onClick),
      })}
      onClick={onClick}
      Icon={Icon}
    />
  )
}

export default SelectIndicator
