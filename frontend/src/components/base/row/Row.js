import React, { forwardRef, ElementType, ReactNode, Ref, useCallback } from 'react'
import classNames from 'classnames'
import omit from 'lodash/omit'
import './row.scss'

export type RowProps = {
  className?: string,
  children: ReactNode,
  vertical?: 'top' | 'center' | 'bottom' | 'line' | 'stretch' | null,
  horizontal?:
    | 'left'
    | 'center'
    | 'right'
    | 'stretch'
    | 'between'
    | 'around'
    | 'evenly'
    | null,
  wrap?: boolean,
  stretch?: boolean,
  Component?: ElementType,
}

const Row = (props: RowProps, ref: Ref<any>) => {
  const {
    className = '',
    children = null,
    wrap = false,
    stretch = false,
    Component = 'div',
    ...other
  } = props

  const getClassName = useCallback(
    (dir: string) => {
      const defaultValue = dir === 'vertical' ? 'center' : 'left'
      const value = props[dir] ?? defaultValue
      return ['center', 'stretch'].includes(value) ? `${dir}-${value}` : value
    },
    [props],
  )

  return (
    <Component
      {...omit(other, ['vertical', 'horizontal'])}
      ref={ref}
      className={classNames(
        'row',
        className,
        getClassName('vertical'),
        getClassName('horizontal'),
        { wrap, stretch },
      )}
    >
      {children}
    </Component>
  )
}

export default forwardRef(Row)
