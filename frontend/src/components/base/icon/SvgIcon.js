import React, { useCallback, ReactElement } from 'react'
import classNames from 'classnames'
import { stopPropagationEvent } from 'utils/common'
import './svg-icon.scss'

export type SvgIconType = ReactElement

export type SvgIconProps = {
  className?: string,
  Icon: SvgIconType,
  onClick?: () => void,
  isClickable?: boolean,
}

const SvgIcon = (props: SvgIconProps) => {
  const { className = '', Icon, onClick, isClickable = false, ...other } = props

  const _onClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (onClick) {
        stopPropagationEvent(event)
        onClick()
      }
    },
    [onClick],
  )

  return (
    <div
      {...other}
      className={classNames('svg-icon', className, {
        'svg-icon--clickable': isClickable || Boolean(onClick),
      })}
      onClick={_onClick}
    >
      <Icon />
    </div>
  )
}

export default SvgIcon
