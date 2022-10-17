import React, { ElementType, ReactNode, forwardRef, Ref, useMemo } from 'react'
import classNames from 'classnames'
import './text.scss'

export type TextTypes = 'normal' | 'medium' | 'bold'
export type TextVariants = 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export type TextProps = {
  className?: string,
  children?: ReactNode,
  variant?: TextVariants,
  Component?: ElementType,
  uppercase?: boolean,
  type?: TextTypes,
  center?: boolean,
  right?: boolean,
  crossed?: boolean,
  underline?: boolean,
  primary?: boolean,
  theme?: 'base',
}

const Text = (props: TextProps, ref: Ref) => {
  const {
    className = '',
    children = null,
    variant = 'md',
    Component = 'div',
    uppercase = false,
    type = 'normal',
    center = false,
    right = false,
    crossed = false,
    underline = false,
    theme = 'base',
    primary = false,
    ...other
  } = props

  const weightByType = useMemo(() => ({ normal: 400, medium: 500, bold: 700 }), [])

  return (
    <Component
      {...other}
      ref={ref}
      className={classNames('text', className, {
        uppercase,
        center,
        right,
        crossed,
        underline,
        primary,
        [theme]: theme !== 'base',
        [`text-${variant}`]: Boolean(variant),
      })}
      style={['sm', 'md'].includes(variant) ? { fontWeight: weightByType[type] } : {}}
    >
      {children}
    </Component>
  )
}

export default forwardRef(Text)
