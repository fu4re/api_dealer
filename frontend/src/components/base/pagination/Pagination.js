import React, { ChangeEvent } from 'react'
import classNames from 'classnames'
import { default as MuiPagination } from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import { ICONS } from 'assets/icons/icons'
import './pagination.scss'

export type PaginationProps = {
  count: number,
  onChange?: (event: ChangeEvent<unknown>, page: number) => void,
  className?: string,
}

const Pagination = (props: PaginationProps) => {
  const { count, onChange, className = '' } = props

  return (
    <MuiPagination
      className={classNames('pagination', className)}
      count={count}
      onChange={onChange}
      renderItem={(item) => (
        <PaginationItem
          components={{ previous: ICONS.arrowLeft, next: ICONS.arrowRight }}
          {...item}
        />
      )}
    />
  )
}

export default Pagination
