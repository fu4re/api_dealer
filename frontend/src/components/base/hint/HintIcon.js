import React, { CSSProperties, ReactComponentElement, useCallback } from 'react'
import classNames from 'classnames'
import Tooltip from 'components/base/tooltip/Tooltip'
import { stopPropagationEvent } from 'utils/common'
import './hint.scss'

export type HintIconProps = {
  className?: string,
  Component?: ReactComponentElement,
  title?: string,
  onClick?: (event: MouseEvent) => void,
  isInline?: boolean,
  backgroundColor?: string,
  style?: CSSProperties,
  size?: 'base' | 'small',
}

const HintIcon = (props: HintIconProps) => {
  const {
    className = '',
    Component = 'div',
    title,
    onClick,
    isInline = false,
    backgroundColor = false,
    style = {},
    size = 'base',
  } = props

  const _onClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      stopPropagationEvent(event)
      onClick?.()
    },
    [onClick],
  )

  return (
    <Tooltip title={title}>
      <Component
        className={classNames(className, 'hint-icon', {
          'hint-icon--disabled': !title && !onClick,
          'hint-icon--inline': isInline,
          'hint-icon--clickable': Boolean(onClick),
          [size]: size !== 'base',
        })}
        onClick={_onClick}
        style={{ backgroundColor, ...style }}
      >
        {'?'}
      </Component>
    </Tooltip>
  )
}

export default HintIcon
