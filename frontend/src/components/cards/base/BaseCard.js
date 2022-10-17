import React, { ReactNode, CSSProperties, ElementType } from 'react'
import classNames from 'classnames'
import Row from 'components/base/row/Row'
import './base.scss'

export type BaseCardProps = {
  className?: string,
  renderContent?: () => ReactNode,
  size?: 'base' | 'large',
  stretch?: boolean,
  style?: CSSProperties,
  onClick?: () => void,
  Component?: ElementType,
}

const BaseCard = (props: BaseCardProps) => {
  const {
    className = '',
    renderContent,
    size = 'base',
    stretch = false,
    style = {},
    onClick,
    Component = Row,
    ...other
  } = props

  return (
    <Component
      style={style}
      onClick={onClick}
      className={classNames('card', className, { [size]: size !== 'base', stretch })}
      {...other}
    >
      {renderContent?.()}
    </Component>
  )
}

export default BaseCard
