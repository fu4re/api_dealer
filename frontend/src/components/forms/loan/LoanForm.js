import React, { useMemo, useCallback, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { FormikValues } from 'formik'
import classNames from 'classnames'
import reduce from 'lodash/reduce'
import flattenDeep from 'lodash/flattenDeep'
import Button from 'components/base/button/Button'
import Row from 'components/base/row/Row'
import Text from 'components/base/text/Text'
import Form from 'components/forms/form/Form'
import Preloader from 'components/base/preloader/Preloader'
import OverlayPreloader from 'components/base/preloader/OverlayPreloader'
import Confirm from 'components/base/confirm/Confirm'
import SliderCard from 'components/cards/slider/SliderCard'
import SwitchCard from 'components/cards/switch/SwitchCard'
import ColumnsCard from 'components/cards/columns/ColumnsCard'
import LoadErrorNotice from 'components/base/notice/LoadErrorNotice'
import SnackbarUtils from 'config/snackbars/snackbarConfig'
import { FIELD_TYPES } from 'components/forms/field/Field'
import { ROUTER_PATHS } from 'constants/router'
import { FormValidators } from 'constants/validation'
import { BASE_RESULTS, PRESCORING_FIELDS, PRESCORE_STATUSES } from 'constants/loan'
import { FIELDS } from 'constants/fields'
import { isAuthSelector } from 'store/Settings/reducers'
import { calculate, prescore } from 'network/requests'
import { createValidationSchema } from 'utils/forms/validation'
import { getPersonal, getCurrencyInput } from 'utils/forms/fields'
import { getInitialValues, parseNumber, removeSymbols } from 'utils/common'
import type { HttpResponseError } from 'network/HttpClient'
import './loan.scss'

export type LoanFormProps = {
  onClick?: (data: Record<string, any>) => void,
  onClickBack?: () => void,
  className?: string,
  values?: Record<string, any>,
}

const LoanForm = (props: LoanFormProps) => {
  const { onClickBack, onClick, className = '', values = {} } = props

  const { switches = [], sliders: _sliders = [], genders = [], car = {} } = values || {}

  const [data, setData] = useState({})
  const [resultData, setResultData] = useState({})
  const [isFetching, setIsFetching] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [results, setResults] = useState(BASE_RESULTS)
  const [sliders, setSliders] = useState(_sliders)

  const navigate = useNavigate()

  const isAuth = useSelector(isAuthSelector)

  const initialValues = useMemo(() => getInitialValues('', PRESCORING_FIELDS), [])

  const validationSchema = useMemo(() => {
    const excludedStringKeys = [FIELDS.email, FIELDS.phone, FIELDS.salary]

    return createValidationSchema({
      ...getInitialValues(
        FormValidators.required,
        PRESCORING_FIELDS.filter((i) => !excludedStringKeys.includes(i)),
      ),
      [FIELDS.email]: FormValidators.email,
      [FIELDS.phone]: FormValidators.phone,
      [FIELDS.salary]: FormValidators.positiveNumber,
    })
  }, [])

  const blocks = useMemo(
    () => ({
      ...getPersonal('Личная информация', '', genders),
      row: {
        blocks: {
          [FIELDS.salary]: getCurrencyInput(
            'Ежемесячный доход',
            'Обращаем внимание, что платеж по кредиту не должен превышать третью часть вашего дохода',
          ),
          [FIELDS.birthPlace]: {
            fieldType: FIELD_TYPES.input,
            caption: 'Место рождения',
          },
        },
      },
    }),
    [genders],
  )

  const getSales = useCallback(() => {
    const keys = switches.map(({ name }) => name)

    const value = keys.reduce((acc, key) => {
      acc += data[key] ? switches.find(({ name }) => name === key)?.sale || 0 : 0
      return acc
    }, 0)

    return Number(value.toFixed(1))
  }, [data, switches])

  const stats = useMemo(() => {
    return results.map((i) => {
      return i.map((item) => {
        const isPercent = item.id === 'percent'

        const value = isPercent
          ? Number((item.value - getSales()).toFixed(1))
          : item.value

        return { ...item, value: isPercent && value < 0 ? 0 : value }
      })
    })
  }, [results, getSales])

  const onSubmit = useCallback(
    (values: FormikValues) => {
      setIsSubmitting(true)

      const newValues = reduce(
        Object.keys(values),
        (acc, key) => {
          const value = values[key]
          acc[key] = key === FIELDS.salary ? parseNumber(value) : value
          return acc
        },
        {},
      )

      const {
        email,
        salary,
        birthday,
        birth_place,
        name,
        surname,
        patronomic,
        gender,
        phone,
      } = newValues

      const { price, brand } = car

      const statsItems = flattenDeep(stats)

      const getStatValue = (key: string) => {
        return statsItems.find(({ id }) => id === key)?.value || 0
      }

      const sendData = {
        comment: '',
        customer_party: {
          email,
          income_amount: salary,
          person: {
            birth_date_time: birthday.split('.').reverse().join('-'),
            birth_place,
            family_name: surname,
            first_name: name,
            gender,
            middle_name: patronomic,
            nationality_country_code: 'RU',
          },
          phone: removeSymbols(phone, ['(', ')', ' ', '-']),
        },
        interest_rate: getStatValue('percent'),
        requested_amount: getStatValue('sum'),
        requested_term: getStatValue('term'),
        trade_mark: brand,
        vehicle_cost: price,
      }

      prescore(sendData)
        .then(({ responseData: data }: Record<string, any>) => {
          const { application_status: status } = data || {}

          setIsSubmitting(false)

          if (status === PRESCORE_STATUSES.approved) {
            SnackbarUtils.enqueueSnackbar('Заявка на кредит предварительно одобрена', {
              variant: 'success',
            })

            onClick?.({ stats: statsItems, ...newValues })
            return
          }

          if (status === PRESCORE_STATUSES.denied) {
            SnackbarUtils.enqueueSnackbar('Заявка на кредит отклонена', {
              variant: 'error',
            })

            navigate(ROUTER_PATHS.CRM)
            return
          }
        })
        .catch((error: HttpResponseError) => {
          setIsSubmitting(false)
          Confirm.showError({
            message: 'Во время предварительной проверки произошла ошибка',
            error,
          })
          console.warn(error)
        })
    },
    [setIsSubmitting, navigate, onClick, stats, car],
  )

  const updateFields = useCallback(
    (isInitial: boolean = false, params: Record<string, any> = {}) => {
      const { initialFee, term } = params

      const setStateCallback = isInitial ? setIsFetching : setIsCalculating

      setStateCallback(true)

      calculate({ cost: car.price, ...(isInitial ? {} : { initialFee, term }) })
        .then(({ responseData }: Record<string, any>) => {
          const initialTerm = responseData.term?.min || 1

          setResults((prev) => {
            return prev.map((i) => {
              return i.map((item) => ({
                ...item,
                value:
                  item.id === 'term'
                    ? isInitial
                      ? initialTerm
                      : data.term ?? initialTerm
                    : responseData[item.id] || null,
              }))
            })
          })

          if (isInitial) {
            setSliders((prev) => {
              return prev.map((i) => {
                const params = responseData[i.name] || {}
                const initialValue = params.min || i.initialValue

                return {
                  ...i,
                  ...params,
                  initialValue,
                  step: i.name === 'term' ? 1 : Math.trunc(params.max / 100),
                }
              })
            })

            setData((prev) => ({
              ...prev,
              term: initialTerm,
              initialFee: responseData.initialFee.min,
            }))
          }
        })
        .catch((error: HttpResponseError) => {
          Confirm.showError({
            message: 'При загрузке информации произошла ошибка',
            error,
          })
          console.warn(error)
        })
        .finally(() => setStateCallback(false))
    },
    [car, data, setData, setIsFetching, setResults, setIsCalculating, setSliders],
  )

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    Boolean(values.car?.price) && values.firstStep && updateFields(true)
  }, [values.car])

  const onChangeField = useCallback(
    (name: string, value: number) => setData((prev) => ({ ...prev, [name]: value })),
    [setData],
  )

  const onChangeResult = useCallback(
    (name: string, value: number) => {
      setResultData((prev) => ({ ...prev, [name]: value }))
      updateFields(false, { ...resultData, [name]: value })
    },
    [setResultData, updateFields, resultData],
  )

  const items = useMemo(
    () => [
      { text: 'Рассчитайте ваш автокредит', collection: sliders, Component: SliderCard },
      { text: 'Страховые услуги', collection: switches, Component: SwitchCard },
    ],
    [sliders, switches],
  )

  const renderAtResultsEnd = useCallback(
    () => (
      <>
        <Text primary className="loan__full">
          {'Полные условия'}
        </Text>
        <Text className="loan__caption">
          {'Расчёт предварительный. Страховые услуги приобретаются добровольно.'}
        </Text>
      </>
    ),
    [],
  )

  const renderBackButton = useCallback(
    () => <Button variant="outline" onClick={onClickBack} text="Вернуться назад" />,
    [onClickBack],
  )

  const token = window.localStorage.getItem('token')
  const from_widget = window.localStorage.getItem('from_widget')

  if (!token && !from_widget && !isAuth) {
    return <Navigate to={ROUTER_PATHS.LOGIN} />
  }

  if (isFetching) {
    return <Preloader size={80} />
  }

  if (results.some((i) => i.some(({ value }) => value === null))) {
    return (
      <div className={className}>
        <LoadErrorNotice />
        <Row horizontal="center">{renderBackButton?.()}</Row>
      </div>
    )
  }

  return (
    <div className={classNames('loan', className)}>
      <Row vertical="top" horizontal="between" className="loan__row">
        <div className="loan-fields">
          {items.map(({ text = '', collection = [], Component }, index) => (
            <div key={index} className="loan-fields__block">
              <Text variant="lg" className="loan-fields__block-title">
                {text}
              </Text>
              {collection.map((item, index) => (
                <Component
                  key={index}
                  {...item}
                  onChange={onChangeField}
                  onChangeCommitted={onChangeResult}
                  disabled={isCalculating}
                />
              ))}
            </div>
          ))}
          <Text className="loan__caption">
            {'Все страховые сервисные услуги при их наличии, приобретаются добровольно.'}
          </Text>
        </div>
        <ColumnsCard
          isFetching={isCalculating}
          columns={stats}
          renderAtEnd={renderAtResultsEnd}
          loaderSize={44}
        />
      </Row>
      {isSubmitting && <OverlayPreloader preloaderProps={{ size: 80 }} />}
      <Form
        initialValues={initialValues}
        validationSchema={validationSchema}
        className="loan-form"
        renderBeforeButton={renderBackButton}
        blocks={blocks}
        buttonProps={{ text: 'Далее' }}
        onSubmit={onSubmit}
        withReset={false}
      />
    </div>
  )
}

export default LoanForm
