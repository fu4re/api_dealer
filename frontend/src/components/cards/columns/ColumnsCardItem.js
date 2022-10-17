import React from 'react'
import classNames from 'classnames'
import Text from 'components/base/text/Text'
import Skeleton from '@mui/material/Skeleton'
import './columns.scss'

export type ColumnsCardItemType = {
  title?: string,
  value?: number,
  valueModifier?: (value: number) => String,
  isCompact?: boolean,
  isFetching?: boolean,
  loaderSize?: number,
}

export type ColumnsCardItemProps = ColumnsCardItemType

const ColumnsCardItem = (props: ColumnsCardItemProps) => {
  const {
    title = '',
    value = 0,
    valueModifier,
    isCompact = false,
    isFetching = false,
    loaderSize = 28,
  } = props

  return (
    <div className={classNames('columns-card__item', { compact: isCompact })}>
      <Text className="columns-card__item-text">{title}</Text>
      {isFetching ? (
        <Skeleton
          width={100}
          height={loaderSize}
          variant="rect"
          className="columns-card__item-load"
        />
      ) : (
        <Text variant={isCompact ? 'lg' : 'xxl'} className="columns-card__item-value">
          {valueModifier?.(value) ?? value}
        </Text>
      )}
    </div>
  )
}

export default ColumnsCardItem
