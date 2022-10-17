import React, { useState, useCallback, useMemo, useEffect } from 'react'
import classNames from 'classnames'
import reduce from 'lodash/reduce'
import ColumnsCard from 'components/cards/columns/ColumnsCard'
import Table from 'components/base/table/Table'
import Tabs from 'components/base/tabs/Tabs'
import Row from 'components/base/row/Row'
import Text from 'components/base/text/Text'
import Confirm from 'components/base/confirm/Confirm'
import BaseCard from 'components/cards/base/BaseCard'
import LoadErrorNotice from 'components/base/notice/LoadErrorNotice'
import Input from 'components/inputs/input/Input'
import Button from 'components/base/button/Button'
import Preloader from 'components/base/preloader/Preloader'
import { INPUT_TYPES } from 'components/inputs/input/Input'
import { getReports } from 'network/requests'
import { ICONS } from 'assets/icons/icons'
import {
  FUNNEL_TABLES,
  INCOME_TABLES,
  REPORTS_TABS_IDS,
  REPORTS_TABLE_KEYS,
  REPORTS_TABS,
  VALUE_MODIFIERS,
  STATS,
  blocks,
} from 'constants/reports'
import type { HttpResponseError } from 'network/HttpClient'
import type { InputCallbackData } from 'components/inputs/input/Input'
import './reports.scss'

export type ReportsFormProps = {
  className?: string,
}

const ReportsForm = (props: ReportsFormProps) => {
  const { className = '' } = props

  const [isFetching, setIsFetching] = useState(false)
  const [rows, setRows] = useState(null)
  const [columns, setColumns] = useState(null)
  const [date, setDate] = useState('')
  const [stats, setStats] = useState(STATS)

  const onChangeDate = useCallback(
    ({ value }: InputCallbackData) => setDate(value),
    [setDate],
  )

  const onResetDate = useCallback(() => setDate({ from: '', to: '' }), [setDate])

  const onSuccessLoad = useCallback(
    ({ responseData: data }: Record<string, any>) => {
      const { rows = {}, columns = {} } = data || {}

      setRows(rows)
      setColumns(columns)

      setStats((prev) => {
        return reduce(
          Object.keys(STATS),
          (acc, key) => {
            acc[key] = prev[key].map((i) => {
              return i.map((item) => ({
                ...item,
                valueModifier: VALUE_MODIFIERS[item.id],
                value: data.stats[item.id] || null,
              }))
            })

            return acc
          },
          {},
        )
      })
    },
    [setRows, setColumns, setStats],
  )

  const getTableData = useCallback(
    (date: Record<string, any> = {}) => {
      setIsFetching(true)

      getReports(date)
        .then(onSuccessLoad)
        .catch((error: HttpResponseError) => {
          Confirm.showError({ message: 'При загрузке таблицы произошла ошибка', error })
          console.warn(error)
        })
        .finally(() => setIsFetching(false))
    },
    [setIsFetching, onSuccessLoad],
  )

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    getTableData()
  }, [])

  const onClickSearch = useCallback(() => getTableData(date), [getTableData, date])

  const getTableContent = useCallback(
    (key: string) => {
      if ((rows === null || columns === null) && !isFetching) {
        return <LoadErrorNotice />
      }

      const tableRows = rows?.[key] || []
      const tableColumns = columns?.[key] || []

      const renderTable = () => (
        <Table
          rows={tableRows}
          columns={tableColumns}
          hasPopup={false}
          canSelect={false}
        />
      )

      return isFetching ? (
        <Preloader size={80} isBase className="reports__preloader" />
      ) : tableRows === null ? (
        <LoadErrorNotice />
      ) : (
        <BaseCard className="reports__card" renderContent={renderTable} />
      )
    },
    [isFetching, rows, columns],
  )

  const getTabsContent = useCallback(
    ([countName, sumName]: Array<string>) => ({
      [REPORTS_TABS_IDS.count]: getTableContent(countName),
      [REPORTS_TABS_IDS.sum]: getTableContent(sumName),
    }),
    [getTableContent],
  )

  const renderContent = useMemo(
    () => ({
      [REPORTS_TABLE_KEYS.funnel]: getTabsContent(FUNNEL_TABLES),
      [REPORTS_TABLE_KEYS.income]: getTabsContent(INCOME_TABLES),
    }),
    [getTabsContent],
  )

  const dateInput = useMemo(
    () => (
      <Row className="reports__filter">
        <Input
          type={INPUT_TYPES.DATE}
          val={date}
          onChange={onChangeDate}
          onReset={onResetDate}
          isRangeDate
          placeholder="Выберите диапазон дат"
          disabled={isFetching}
          allowClearForRangeDates
        />
        <Button
          onClick={onClickSearch}
          iconStart={ICONS.search}
          isFetching={isFetching}
          className="reports__filter-button"
        />
      </Row>
    ),
    [date, isFetching, onChangeDate, onResetDate, onClickSearch],
  )

  return (
    <div className={classNames('reports', className)}>
      {blocks.map(({ title = '', key = '', cardTitle = '' }, index) => (
        <div key={index} className="reports-content">
          <Row horizontal="between" className="reports-content__header">
            <Text variant="lg">{title}</Text>
            {key === REPORTS_TABLE_KEYS.funnel && dateInput}
          </Row>
          <Row vertical="top" horizontal="between" className="reports-content__row">
            <Tabs
              tabs={REPORTS_TABS}
              renderContent={renderContent[key] || {}}
              className="reports__tabs"
            />
            <ColumnsCard
              isFetching={isFetching}
              columns={stats[key]}
              title={cardTitle}
              isCompact
              isColumn
            />
          </Row>
        </div>
      ))}
    </div>
  )
}

export default ReportsForm
