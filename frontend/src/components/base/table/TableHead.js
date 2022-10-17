import React, { CSSProperties } from 'react'
import { TableHead as BaseTableHead } from '@mui/material'
import TableSortLabel from '@mui/material/TableSortLabel'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Checkbox, { CHECKED_PARTIALLY } from 'components/checkboxes/Checkbox'
import type { CheckboxCallbackData } from 'components/checkboxes/Checkbox'

export const COLUMN_TYPES = {
  text: 'text',
  progress: 'progress',
  boolean: 'boolean',
  price: 'price',
  number: 'number',
  date: 'date',
}

export type TableHeadColumnType = Partial<CSSProperties> & {
  id: string,
  label: string,
  type?: $Values<typeof COLUMN_TYPES>,
  sortable?: boolean,
}

export type TableHeadProps = {
  selectedCount?: number,
  onSort?: (column: string) => void,
  onSelectAll?: (data: CheckboxCallbackData) => void,
  order?: 'asc' | 'desc',
  orderBy?: string,
  rowsCount?: number,
  columns?: Array<TableHeadColumnType>,
  hasPopup?: boolean,
  canSelect?: boolean,
}

const TableHead = (props: TableHeadProps) => {
  const {
    onSelectAll,
    order = '',
    orderBy = '',
    selectedCount = 0,
    rowsCount = 0,
    onSort,
    columns = [],
    hasPopup = true,
    canSelect = true,
  } = props

  return (
    <BaseTableHead>
      <TableRow>
        {canSelect && (
          <TableCell style={{ width: 40 }}>
            <Checkbox
              onChange={onSelectAll}
              value={
                selectedCount === 0
                  ? false
                  : selectedCount === rowsCount
                  ? true
                  : CHECKED_PARTIALLY
              }
            />
          </TableCell>
        )}
        {columns.map((column) => {
          const {
            id,
            label,
            width,
            minWidth,
            maxWidth,
            type = COLUMN_TYPES.text,
            sortable = true,
          } = column

          const canSort = type === COLUMN_TYPES.text && sortable

          return (
            <TableCell
              key={id}
              sortDirection={canSort ? (orderBy === id ? order : false) : false}
              style={{ width, minWidth, maxWidth }}
            >
              {canSort ? (
                <TableSortLabel
                  active={orderBy === id}
                  direction={orderBy === id ? order : 'asc'}
                  onClick={() => onSort(id)}
                >
                  {label}
                </TableSortLabel>
              ) : (
                label
              )}
            </TableCell>
          )
        })}
        {hasPopup && <TableCell />}
      </TableRow>
    </BaseTableHead>
  )
}

export default TableHead
