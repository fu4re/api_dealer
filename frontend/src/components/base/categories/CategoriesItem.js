import React, { useCallback } from 'react'
import classNames from 'classnames'
import size from 'lodash/size'
import Text from 'components/base/text/Text'
import Row from 'components/base/row/Row'
import Badge, { BADGE_SIZES } from 'components/base/badge/Badge'
import './categories.scss'

export type CategoriesItemType = {
  id: string,
  text: string,
  count: number,
}

export type CategoriesItemProps = CategoriesItemType & {
  isActive?: boolean,
  onClick?: (id: string) => void,
}

const CategoriesItem = (props: CategoriesItemProps) => {
  const { id = '', text = '', count = 0, isActive = false, onClick } = props

  const _onClick = useCallback(() => onClick?.(id), [onClick, id])

  return size(text) > 0 ? (
    <li
      className={classNames('categories__item', { active: isActive })}
      onClick={_onClick}
    >
      {count > 0 ? (
        <Row className="categories__item-row">
          <Text className="categories__item-text">{text}</Text>
          <Badge size={BADGE_SIZES.small} text={String(count)} rounded />
        </Row>
      ) : (
        <Text className="categories__item-text">{text}</Text>
      )}
    </li>
  ) : null
}

export default CategoriesItem
