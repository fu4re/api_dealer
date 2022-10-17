import React, { useMemo, useCallback, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Navigate } from 'react-router-dom'
import classNames from 'classnames'
import size from 'lodash/size'
import toLower from 'lodash/toLower'
import Tabs from 'components/base/tabs/Tabs'
import Confirm from 'components/base/confirm/Confirm'
import LoadErrorNotice from 'components/base/notice/LoadErrorNotice'
import Row from 'components/base/row/Row'
import Preloader from 'components/base/preloader/Preloader'
import Table from 'components/base/table/Table'
import Button from 'components/base/button/Button'
import Header from 'components/header/Header'
import BaseCard from 'components/cards/base/BaseCard'
import ReportsForm from 'components/forms/reports/ReportsForm'
import NoRequestsCard from 'components/cards/no-requests/NoRequestsCard'
import Input from 'components/inputs/input/Input'
import { INPUT_TYPES } from 'components/inputs/input/Input'
import { getTable } from 'network/requests'
import { ROUTER_PATHS } from 'constants/router'
import { isAuthSelector } from 'store/Settings/reducers'
import type { InputCallbackData } from 'components/inputs/input/Input'
import './crm.scss'

const TABS_IDS = {
  requests: 'requests',
  reports: 'reports',
  archive: 'archive',
}

const TABLE_TABS = [TABS_IDS.requests, TABS_IDS.archive]

const CRM_TABS = [
  { id: TABS_IDS.requests, text: 'Заявки' },
  { id: TABS_IDS.reports, text: 'Отчеты' },
  { id: TABS_IDS.archive, text: 'Архив' },
]

const CRM = () => {
  const isAuth = useSelector(isAuthSelector)

  const navigate = useNavigate()

  const [isFetching, setIsFetching] = useState(true)
  const [search, setSearch] = useState('')
  const [rows, setRows] = useState(null)
  const [columns, setColumns] = useState(null)
  const [activeTab, setActiveTab] = useState(CRM_TABS[0].id)

  const isArchive = activeTab === TABS_IDS.archive

  const resetTable = useCallback(() => {
    setRows(null)
    setColumns(null)
  }, [setRows, setColumns])

  const onSuccessLoad = useCallback(
    ({ responseData: data }: Record<string, any>) => {
      const { rows = [], columns = [] } = data || {}

      setRows(rows)
      setColumns(columns)
    },
    [setRows, setColumns],
  )

  const getTableData = useCallback(
    (id: string) => {
      setIsFetching(true)

      getTable(id === TABS_IDS.archive)
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
    getTableData(activeTab)
  }, [])

  const onChangeSearch = useCallback(
    ({ value }: InputCallbackData) => setSearch(value),
    [setSearch],
  )

  const onResetSearch = useCallback(() => setSearch(''), [setSearch])

  const searchInput = useMemo(
    () => (
      <Input
        type={INPUT_TYPES.text}
        placeholder="Введите ФИО клиента"
        className="crm__search"
        val={search}
        onChange={onChangeSearch}
        onReset={onResetSearch}
      />
    ),
    [search, onChangeSearch, onResetSearch],
  )

  const resultRows = useMemo(
    () =>
      Array.isArray(rows) && size(rows) > 0
        ? rows.filter(({ name }) => toLower(name).indexOf(toLower(search)) !== -1)
        : [],
    [rows, search],
  )

  const table = useMemo(() => {
    const popupProps = {
      isArchive,
      onBeforeAction: () => setIsFetching(true),
      onAfterAction: () => setIsFetching(false),
      onArchiveAction: () => getTableData(activeTab),
    }

    return (
      <Table
        rows={resultRows}
        columns={columns}
        popupProps={popupProps}
        isSearching={size(search) > 0}
      />
    )
  }, [resultRows, columns, isArchive, search, activeTab, setIsFetching, getTableData])

  const onClickCreate = useCallback(() => navigate(ROUTER_PATHS.REQUEST), [navigate])

  const createButton = useMemo(
    () => <Button text="Создать заявку" onClick={onClickCreate} />,
    [onClickCreate],
  )

  const renderTable = useCallback(
    () => (
      <>
        <Row horizontal="between" className="crm-card__header">
          {searchInput}
          {createButton}
        </Row>
        {table}
      </>
    ),
    [searchInput, table, createButton],
  )

  const tableContent = useMemo(() => {
    return isFetching ? (
      <Preloader size={80} />
    ) : rows === null ? (
      <>
        <LoadErrorNotice />
        {activeTab === TABS_IDS.requests && <Row horizontal="center">{createButton}</Row>}
      </>
    ) : Array.isArray(rows) && size(rows) === 0 ? (
      <NoRequestsCard isArchive={isArchive} />
    ) : (
      <BaseCard className="crm-card" renderContent={renderTable} />
    )
  }, [rows, isFetching, activeTab, createButton, isArchive, renderTable])

  const renderContent = useMemo(
    () => ({
      [TABS_IDS.requests]: tableContent,
      [TABS_IDS.reports]: <ReportsForm className="crm-reports" />,
      [TABS_IDS.archive]: tableContent,
    }),
    [tableContent],
  )

  const onChangeTab = useCallback(
    (id: string) => {
      resetTable()
      setActiveTab(id)
      TABLE_TABS.includes(id) && getTableData(id)
      id === TABS_IDS.reports && setIsFetching(false)
    },
    [setActiveTab, setIsFetching, resetTable, getTableData],
  )

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to={ROUTER_PATHS.LOGIN} />
  }

  return (
    <div className={classNames('crm', 'container')}>
      <Header />
      <Tabs tabs={CRM_TABS} renderContent={renderContent} onChangeTab={onChangeTab} />
    </div>
  )
}

export default CRM
