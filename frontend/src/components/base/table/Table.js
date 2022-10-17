import React, { useState, useCallback, useMemo } from 'react'
import classNames from 'classnames'
import lodashSize from 'lodash/size'
import isPlainObject from 'lodash/isPlainObject'
import { Table as BaseTable } from '@mui/material'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import HintIcon from 'components/base/hint/HintIcon'
import Tooltip from 'components/base/tooltip/Tooltip'
import TableHead, { COLUMN_TYPES } from 'components/base/table/TableHead'
import Checkbox from 'components/checkboxes/Checkbox'
import TablePopupMenu from 'components/base/popup/TablePopupMenu'
import ProgressBar from 'components/base/progress/ProgressBar'
import Row from 'components/base/row/Row'
import Text from 'components/base/text/Text'
import NotFoundNotice from 'components/base/notice/NotFoundNotice'
import NoItemsCard from 'components/cards/no-items/NoItemsCard'
import SvgIcon from 'components/base/icon/SvgIcon'
import { ICONS } from 'assets/icons/icons'
import { TABLE_ITEMS } from 'constants/menu'
import { getComparator, formatPrice } from 'utils/common'
import { onArchiveClick } from 'utils/specific'
import type { CheckboxCallbackData } from 'components/checkboxes/Checkbox'
import type { TableHeadColumnType } from 'components/base/table/TableHead'
import './table.scss'

export type TableProps = {
  rows: Array<Record<string, any>>,
  columns: Array<TableHeadColumnType>,
  rowsPerPageOptions?: Array<number | Record<string, any>>,
  rowsPerPage?: number,
  popupProps?: Record<string, any>,
  hasPopup?: boolean,
  canSelect?: boolean,
  isSearching?: boolean,
}

const Table = (props: TableProps) => {
  const {
    rows = [],
    columns = [],
    rowsPerPageOptions = [10, 20, 30],
    rowsPerPage: _rowsPerPage = 10,
    popupProps = {},
    hasPopup = true,
    canSelect = true,
    isSearching = false,
  } = props

  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('')
  const [columnName, setColumnName] = useState('id')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(_rowsPerPage)

  const onSort = useCallback(
    (column: string) => {
      const isAsc = orderBy === column && order === 'asc'

      setOrder(isAsc ? 'desc' : 'asc')
      setOrderBy(order === 'desc' ? '' : column)
    },
    [orderBy, order, setOrder, setOrderBy],
  )

  const onSelectAll = useCallback(
    ({ value }: CheckboxCallbackData) => {
      setSelected(value === true ? rows.map((i) => i[columnName]) : [])
    },
    [setSelected, rows, columnName],
  )

  const onClickRow = useCallback(
    (name: string) => {
      if (!canSelect) {
        return
      }

      const newItems = selected.includes(name)
        ? selected.filter((i) => i !== name)
        : [...selected, name]

      setSelected(newItems)
    },
    [canSelect, selected, setSelected],
  )

  const onPageChange = useCallback(
    (_: MouseEvent<HTMLDivElement>, newPage: number) => setPage(newPage),
    [setPage],
  )

  const onRowsPerPageChange = useCallback(
    ({ target }: Event) => {
      setRowsPerPage(parseInt(target.value, 10))
      setPage(0)
    },
    [setRowsPerPage, setPage],
  )

  const isSelected = useCallback(
    (value: string) => selected.indexOf(value) !== -1,
    [selected],
  )

  const selectedCount = useMemo(() => lodashSize(selected), [selected])
  const rowsCount = useMemo(() => lodashSize(rows), [rows])

  // Avoid a layout jump when reaching the last page with empty rows
  const emptyRows = useMemo(
    () => (page > 0 ? Math.max(0, (page + 1) * rowsPerPage - rowsCount) : 0),
    [page, rowsPerPage, rowsCount],
  )

  const headProps = useMemo(
    () => ({ selectedCount, order, orderBy, onSelectAll, onSort, rowsCount, columns }),
    [selectedCount, order, orderBy, onSelectAll, onSort, rowsCount, columns],
  )

  const items = useMemo(
    () =>
      rows
        .slice()
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, (page + 1) * rowsPerPage),
    [rows, order, orderBy, page, rowsPerPage],
  )

  const labelDisplayedRows = useCallback(({ from, to, count }) => {
    return `${from} – ${to} из ${count !== -1 ? count : `более ${to}`}`
  }, [])

  const tableItem = useMemo(
    () => TABLE_ITEMS(popupProps.isArchive)?.[0] || {},
    [popupProps.isArchive],
  )

  return rowsCount > 0 ? (
    <div className="table-container">
      {selectedCount > 0 && canSelect && (
        <Row horizontal="between" className="table__selected">
          <Text>{`Выбрано: ${selectedCount}`}</Text>
          <Tooltip title={tableItem.title}>
            <div onClick={() => onArchiveClick({ ...popupProps, ids: selected })}>
              {tableItem.renderBefore?.()}
            </div>
          </Tooltip>
        </Row>
      )}
      <BaseTable stickyHeader>
        <TableHead {...headProps} hasPopup={hasPopup} canSelect={canSelect} />
        <TableBody>
          {items.map((row) => {
            const value = row[columnName]
            const isItemSelected = isSelected(value)
            const _onClickRow = () => onClickRow(value)

            return (
              <TableRow
                key={value}
                hover={canSelect}
                onClick={_onClickRow}
                selected={isItemSelected}
              >
                {canSelect && (
                  <TableCell>
                    <Checkbox value={isItemSelected} onChange={_onClickRow} />
                  </TableCell>
                )}
                {Object.keys(row)
                  .filter((i) => i !== 'id')
                  .map((i) => {
                    const type =
                      columns.find(({ id }) => id === i)?.type || COLUMN_TYPES.text

                    const value = row[i]
                    let content = value

                    if (type === COLUMN_TYPES.boolean) {
                      content = (
                        <SvgIcon
                          Icon={value ? ICONS.check : ICONS.close}
                          className={classNames(
                            'table-icon',
                            value ? 'positive' : 'negative',
                          )}
                        />
                      )
                    }

                    if (type === COLUMN_TYPES.progress && isPlainObject(value)) {
                      const {
                        percent = 0,
                        hint = '',
                        title = '',
                        size = 'small',
                        show_percent = false,
                      } = value

                      content = (
                        <div>
                          {[title, hint].some(lodashSize) && (
                            <Row
                              horizontal="between"
                              vertical="line"
                              className="table__progress"
                            >
                              <Text variant="sm">{title}</Text>
                              {lodashSize(hint) > 0 && (
                                <HintIcon title={hint} size="small" />
                              )}
                            </Row>
                          )}
                          <ProgressBar
                            progress={percent}
                            size={size}
                            showPercent={show_percent}
                          />
                        </div>
                      )
                    }

                    if ([COLUMN_TYPES.price, COLUMN_TYPES.number].includes(type)) {
                      content = formatPrice(value, undefined, type !== COLUMN_TYPES.price)
                    }

                    return <TableCell key={i}>{content}</TableCell>
                  })}
                {hasPopup && (
                  <TableCell>
                    <TablePopupMenu {...popupProps} ids={[row.id]} />
                  </TableCell>
                )}
              </TableRow>
            )
          })}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
      </BaseTable>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={rowsCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelDisplayedRows={labelDisplayedRows}
        labelRowsPerPage="Отображать на странице:"
        showFirstButton
        showLastButton
      />
    </div>
  ) : isSearching ? (
    <NotFoundNotice />
  ) : (
    <NoItemsCard title="Пока нет записей" />
  )
}

export default Table
