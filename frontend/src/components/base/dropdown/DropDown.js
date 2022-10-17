import React, { ReactNode } from 'react'
import classNames from 'classnames'
import DropDownItem from 'components/base/dropdown/DropDownItem'
import { getDropDownItemValue } from 'utils/common'
import './dropdown.scss'

export type DropDownItemType = {
  [valueKey: string]: string,
  [childrenKey: string]: DropDownItemType,
  isexpanded?: boolean,
}

export type OnClickItem = (item: DropDownItemType, level: number) => void
export type GetItemPropsType = (item: DropDownItemType) => Record<string, any>
export type DropDownValueKey = string | ((item: DropDownItemType) => string)

export type DropDownCommonProps = {
  onClickItem?: OnClickItem,
  allowClickParent?: boolean,
  defaultOpen?: boolean,
  allOpen?: boolean,
  allowRemoveOnClickSelected?: boolean,
  valueKey?: DropDownValueKey,
  childrenKey?: string,
  activeItems?: Array<string | DropDownItemType>,
  getItemRefCallback?: (value: string) => () => void,
  renderAtItemEnd?: (item: DropDownItemType) => ReactNode,
  renderItemContent?: (item: DropDownItemType) => ReactNode,
  itemVariant?: 'base' | 'small',
}

export type DropDownProps = {
  className?: string,
  itemClassName?: string,
  items: Array<DropDownItemType>,
  getItemProps?: GetItemPropsType,
} & DropDownCommonProps

const DropDown = (props: DropDownProps) => {
  const {
    className = '',
    itemClassName = '',
    items = [],
    allowClickParent = false,
    defaultOpen = false,
    allOpen = false,
    valueKey = 'value',
    childrenKey = 'childs',
    itemVariant = 'base',
    activeItems = [],
    ...other
  } = props

  return (
    <div className={classNames('dropdown', className)}>
      {items.map((item, index) => (
        <DropDownItem
          key={['DropDownItem', getDropDownItemValue(valueKey, item), index].join('_')}
          item={item}
          className={itemClassName}
          allowClickParent={allowClickParent}
          defaultOpen={defaultOpen}
          allOpen={allOpen}
          valueKey={valueKey}
          childrenKey={childrenKey}
          activeItems={activeItems}
          itemVariant={itemVariant}
          {...other}
        />
      ))}
    </div>
  )
}

export default DropDown
