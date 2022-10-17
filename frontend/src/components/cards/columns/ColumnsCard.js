import React, { useMemo, ReactNode } from 'react'
import classNames from 'classnames'
import size from 'lodash/size'
import Row from 'components/base/row/Row'
import Text from 'components/base/text/Text'
import ColumnsCardItem from 'components/cards/columns/ColumnsCardItem'
import type { ColumnsCardItemType } from 'components/cards/columns/ColumnsCardItem'
import './columns.scss'

export type ColumnsCardProps = {
  renderAtEnd?: () => ReactNode,
  columns?: Array<Array<ColumnsCardItemType>>,
  isCompact?: boolean,
  title?: string,
  isColumn?: boolean,
  isFetching?: boolean,
  loaderSize?: number,
}

const ColumnsCard = (props: ColumnsCardProps) => {
  const {
    renderAtEnd,
    columns = [],
    isCompact = false,
    title = '',
    isColumn = false,
    isFetching = false,
    loaderSize,
  } = props

  const content = useMemo(() => {
    if (size(columns) === 0) {
      return null
    }

    return (
      <Row horizontal="between" className="columns-card__container">
        {columns.map((items: Array<ColumnsCardItemType>, i) => (
          <div key={['Column', i].join('_')} className="columns-card__column">
            {items.map((item, index) => (
              <ColumnsCardItem
                key={['ColumnItem', index, i].join('_')}
                {...item}
                isCompact={isCompact}
                isFetching={isFetching}
                loaderSize={loaderSize}
              />
            ))}
          </div>
        ))}
      </Row>
    )
  }, [columns, isCompact, isFetching, loaderSize])

  return (
    <div className={classNames('columns-card', { compact: isCompact, column: isColumn })}>
      {size(title) > 0 && <Text className="columns-card__title">{title}</Text>}
      {content}
      {renderAtEnd?.()}
    </div>
  )
}

export default ColumnsCard
