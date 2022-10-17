import React from 'react'
import classNames from 'classnames'
import size from 'lodash/size'
import ItemBox from 'components/base/box/ItemBox'
import Row from 'components/base/row/Row'
import NoItemsNotice from 'components/base/notice/NoItemsNotice'
import type { ItemType } from 'constants/types'
import type { ItemBoxProps } from 'components/base/box/ItemBox'
import './box.scss'

export type ItemBoxesProps = Partial<ItemBoxProps> & {
  items: Array<ItemType>,
  className?: string,
  onClickRemove?: (item: ItemType) => void,
}

const ItemBoxes = (props: ItemBoxesProps) => {
  const {
    items = [],
    className = '',
    onClickRemove,
    noItemsText = 'Пока нет элементов',
    withConfirm = false,
  } = props

  if (size(items) === 0) {
    return <NoItemsNotice message={noItemsText} />
  }

  return (
    <Row wrap className={classNames('item-boxes', className)}>
      {items.map((item: ItemType) => {
        const _onClickRemove = onClickRemove ? () => onClickRemove(item) : void 0

        return (
          <ItemBox
            key={item.displayname}
            item={item}
            active
            onClickRemove={_onClickRemove}
            withConfirm={withConfirm}
          />
        )
      })}
    </Row>
  )
}

export default ItemBoxes
