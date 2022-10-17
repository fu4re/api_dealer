import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import classNames from 'classnames'
import Header from 'components/header/Header'
import Title from 'components/base/text/Title'
import Text from 'components/base/text/Text'
import Confirm from 'components/base/confirm/Confirm'
import Preloader from 'components/base/preloader/Preloader'
import RequestForm from 'components/forms/request/RequestForm'
import LoanForm from 'components/forms/loan/LoanForm'
import CarsList from 'components/cars/CarsList'
import { ROUTER_PATHS } from 'constants/router'
import { getRequestFormData } from 'network/requests'
import { isAuthSelector } from 'store/Settings/reducers'
import { getQueryParams } from 'utils/common'
import './request.scss'

const STEPS_COUNT = 3

const Request = () => {
  const { from_widget = false } = getQueryParams()

  Boolean(from_widget) && window.localStorage.setItem('from_widget', 'from_widget')

  const isAuth = useSelector(isAuthSelector)

  const [progress, setProgress] = useState(0)
  const [data, setData] = useState({})
  const [isFetching, setIsFetching] = useState({})

  const getInitialFormData = useCallback(() => {
    setIsFetching(true)

    getRequestFormData()
      .then(({ responseData: data }: Record<string, any>) => {
        setData((prev) => ({ ...prev, ...data }))
      })
      .catch((error: HttpResponseError) => {
        Confirm.showError({ message: 'При загрузке формы произошла ошибка', error })
        console.warn(error)
      })
      .finally(() => setIsFetching(false))
  }, [setIsFetching, setData])

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    getInitialFormData()
  }, [])

  const onClickBack = useCallback(() => {
    setProgress((prev) => (prev > 0 ? prev - 1 : prev))
  }, [setProgress])

  const onClickNext = useCallback(
    (data: Record<string, any>) => {
      setData((prev) => ({ ...prev, ...data }))
      setProgress((prev) => (prev < STEPS_COUNT - 1 ? prev + 1 : prev))
    },
    [setProgress, setData],
  )

  const forms = useMemo(
    () => [
      { Component: CarsList, onClick: onClickNext },
      { Component: LoanForm, values: data, onClickBack, onClick: onClickNext },
      { Component: RequestForm, values: data, onClickBack },
    ],
    [onClickNext, onClickBack, data],
  )

  if (!from_widget && !window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to={ROUTER_PATHS.LOGIN} />
  }

  return (
    <div className="container">
      <Header />
      <Title text="Создание заявки на кредит" />
      <Text variant="lg" className="request-step">
        {`Шаг ${progress + 1}/${STEPS_COUNT}`}
      </Text>
      {isFetching ? (
        <Preloader size={80} />
      ) : (
        forms.map(({ Component, ...other }, index) => (
          <Component
            key={index}
            {...other}
            className={classNames(index === progress ? 'show' : 'hide')}
          />
        ))
      )}
    </div>
  )
}

export default Request
