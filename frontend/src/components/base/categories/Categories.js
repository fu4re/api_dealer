import React from 'react'
import size from 'lodash/size'
import Row from 'components/base/row/Row'
import CategoriesItem from 'components/base/categories/CategoriesItem'
import type { CategoriesItemType } from 'components/base/categories/CategoriesItem'
import './categories.scss'

export type CategoriesProps = {
  activeId?: string,
  items?: Array<CategoriesItemType>,
  onClickCategory?: (id: string) => void,
}

const Categories = (props: CategoriesProps) => {
  const { activeId, items = [], onClickCategory } = props

  const selected = activeId ?? items?.[0]?.id

  return size(items) > 0 ? (
    <Row className="categories">
      <Row Component="ul" className="categories__items" wrap>
        {items.map((item: CategoriesItemType) => (
          <CategoriesItem
            key={item.id}
            isActive={selected === item.id}
            onClick={onClickCategory}
            {...item}
          />
        ))}
      </Row>
    </Row>
  ) : null
}

export default Categories
