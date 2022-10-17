import React, { useState, useCallback } from 'react'
import classNames from 'classnames'
import size from 'lodash/size'
import { Collapse } from '@material-ui/core'
import SvgIcon from 'components/base/icon/SvgIcon'
import { ICONS } from 'assets/icons/icons'
import {
  stopPropagationEvent,
  getDropDownItemValue,
  getDropDownItemLabel,
} from 'utils/common'
import type {
  DropDownCommonProps,
  DropDownItemType,
  GetItemPropsType,
} from 'components/base/dropdown/DropDown'
import './dropdown.scss'

export type DropDownItemProps = {
  item: DropDownItemType,
  className?: string,
  level?: number,
  getItemProps?: GetItemPropsType,
} & DropDownCommonProps

const DropDownItem = (props: DropDownItemProps) => {
  const {
    className = '',
    item,
    level = 0,
    onClickItem,
    allowClickParent,
    defaultOpen,
    allOpen,
    valueKey,
    childrenKey,
    activeItems,
    getItemRefCallback,
    renderAtItemEnd,
    renderItemContent,
    itemVariant,
    getItemProps,
    allowRemoveOnClickSelected = true,
    ...other
  } = props

  const value = getDropDownItemValue(valueKey, item)
  const label = getDropDownItemLabel(valueKey, item)

  const children = item[childrenKey]
  const hasChildren = size(children) > 0

  const [open, setOpen] = useState(defaultOpen || item.isexpanded)
  const resultOpen = open || allOpen

  const isActive =
    Array.isArray(activeItems) &&
    activeItems.some((i) => [i, getDropDownItemValue(valueKey, i)].includes(value))

  const _onClickItem = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      stopPropagationEvent(event)

      if (!allowRemoveOnClickSelected && isActive) {
        return
      }

      if (hasChildren && !allowClickParent) {
        setOpen((p) => !p)
      } else if (onClickItem && value) {
        onClickItem(item, level)
      } else {
        console.warn('Некорректный элемент (нет value и children): ', item)
      }
    },
    [
      isActive,
      hasChildren,
      allowClickParent,
      onClickItem,
      value,
      item,
      level,
      allowRemoveOnClickSelected,
      setOpen,
    ],
  )

  const onClickToggle = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      stopPropagationEvent(event)
      setOpen((p) => !p)
    },
    [setOpen],
  )

  const renderText = useCallback(
    () => <p className="dropdown__item__text">{label}</p>,
    [label],
  )

  return (
    <>
      <div
        ref={getItemRefCallback ? getItemRefCallback(value) : void 0}
        {...other}
        className={classNames(
          className,
          'dropdown__item',
          `dropdown__item--level_${level}`,
          `dropdown__item--${resultOpen ? 'open' : 'closed'}`,
          `dropdown__item--${itemVariant}`,
          { 'dropdown__item--is-active': isActive },
        )}
        onClick={_onClickItem}
      >
        {hasChildren && (
          <div className="dropdown__item__toggle" onClick={onClickToggle}>
            <SvgIcon Icon={ICONS.chevronDown} className="dropdown__item__toggle__icon" />
          </div>
        )}
        {renderItemContent?.(item) ?? renderText()}
        {renderAtItemEnd?.(item)}
      </div>
      {hasChildren && (
        <Collapse className="dropdown__item__children" in={resultOpen}>
          {children.map((child: DropDownItemType, index) => {
            const itemProps = getItemProps?.(child?.initialData) || {}
            const _value = getDropDownItemValue(valueKey, child)

            return (
              <DropDownItem
                key={['DropDownItem', _value, index].join('_')}
                item={child}
                level={level + 1}
                className={className}
                getItemProps={getItemProps}
                {...itemProps}
                onClickItem={onClickItem}
                allowClickParent={allowClickParent}
                defaultOpen={defaultOpen}
                allOpen={allOpen}
                valueKey={valueKey}
                childrenKey={childrenKey}
                activeItems={activeItems}
                getItemRefCallback={getItemRefCallback}
                renderAtItemEnd={renderAtItemEnd}
                renderItemContent={renderItemContent}
                itemVariant={itemVariant}
              />
            )
          })}
        </Collapse>
      )}
    </>
  )
}

export default DropDownItem
