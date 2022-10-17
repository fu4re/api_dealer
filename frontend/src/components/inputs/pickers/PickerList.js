import React, { useEffect, useRef } from 'react'
import classNames from 'classnames'
import get from 'lodash/get'
import './pickers.scss'

export type PickerListItemtype = {
  value: number | string,
  title: string,
}

export type PickerListProps = {
  className?: string,
  label?: string,
  value: number | string,
  items: Array<PickerListItemtype>,
  onClick: (value: number) => void,
  defaultScrollValue: number | string,
}

const PickerList = (props: PickerListProps) => {
  const { className = '', label, items, value, onClick, defaultScrollValue } = props

  const list = useRef()
  const selectItems = useRef({})

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    // Скролл до активных элементов
    const _list = list.current
    const selectItem = get(selectItems.current, value || defaultScrollValue)

    if (_list && selectItem) {
      const top = selectItem.offsetTop - _list.offsetTop
      const height = (selectItem.clientHeight - _list.clientHeight) / 2.0

      _list.scrollTop = top + height
    }
  }, [])

  return (
    <div className={classNames('picker-list', className)}>
      {Boolean(label) && <div className="picker-list__label">{label}</div>}
      <div ref={list} className="picker-list__items">
        {items.map(({ value: itemValue, title }: PickerListItemtype) => {
          const isActive = value && String(itemValue) === String(value)
          const _onClick = () => onClick(itemValue)

          return (
            <div
              ref={(ref) => (selectItems.current[itemValue] = ref)}
              key={['Item', itemValue].join('_')}
              onClick={_onClick}
              className={classNames('picker-list__item', {
                'picker-list__item--active': isActive,
              })}
            >
              {title}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PickerList

