import React, { useMemo, useCallback, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { FormikValues } from 'formik'
import classNames from 'classnames'
import reduce from 'lodash/reduce'
import BackButton from 'components/buttons/back/BackButton'
import Form from 'components/forms/form/Form'
import Text from 'components/base/text/Text'
import OverlayPreloader from 'components/base/preloader/OverlayPreloader'
import Confirm from 'components/base/confirm/Confirm'
import SnackbarUtils from 'config/snackbars/snackbarConfig'
import { FIELD_TYPES } from 'components/forms/field/Field'
import { FormValidators } from 'constants/validation'
import { MASKS } from 'constants/common'
import { FIELDS, STRING_FIELDS, BOOL_FIELDS, NUMBER_FIELDS } from 'constants/fields'
import { PRESCORING_FIELDS } from 'constants/loan'
import { ROUTER_PATHS } from 'constants/router'
import { isAuthSelector } from 'store/Settings/reducers'
import { sendRequest } from 'network/requests'
import { createValidationSchema } from 'utils/forms/validation'
import {
  getPersonal,
  getNumberInput,
  getCurrencyInput,
  getDateInput,
} from 'utils/forms/fields'
import {
  stopPropagationEvent,
  getSelectorOptions,
  getInitialValues,
  parseNumber,
} from 'utils/common'
import type { HttpResponseError } from 'network/HttpClient'
import './request.scss'

export type RequestFormProps = {
  onClickBack?: () => void,
  className?: string,
  values?: Record<string, any>,
}

const RequestForm = (props: RequestFormProps) => {
  const { onClickBack, className = '', values = {} } = props

  const { genders = [], collections = {} } = values || {}

  const navigate = useNavigate()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dynamicKey, setDynamicKey] = useState(0)

  const forceUpdate = useCallback(() => setDynamicKey((p) => p + 1), [setDynamicKey])

  const isAuth = useSelector(isAuthSelector)

  const initialValues = useMemo(
    () => ({
      ...getInitialValues('', [...STRING_FIELDS, ...NUMBER_FIELDS]),
      ...getInitialValues(false, BOOL_FIELDS),
      ...reduce(
        PRESCORING_FIELDS,
        (acc, key) => {
          acc[key] = values[key]
          return acc
        },
        {},
      ),
    }),
    [values],
  )

  const validationSchema = useMemo(() => {
    const excludedStringKeys = [
      FIELDS.email,
      FIELDS.phone,
      FIELDS.proxyEmail,
      FIELDS.proxyPhone,
      FIELDS.passportNumber,
      FIELDS.passportCode,
      FIELDS.registrationIndex,
    ]

    return createValidationSchema({
      ...getInitialValues(FormValidators.required, [
        ...STRING_FIELDS.filter((i) => !excludedStringKeys.includes(i)),
        ...NUMBER_FIELDS.filter((i) => i !== FIELDS.salary),
      ]),
      ...getInitialValues(FormValidators.email, [FIELDS.email, FIELDS.proxyEmail]),
      ...getInitialValues(FormValidators.phone, [FIELDS.phone, FIELDS.proxyPhone]),
      [FIELDS.agree]: FormValidators.boolean,
      [FIELDS.salary]: FormValidators.positiveNumber,
      [FIELDS.passportNumber]: FormValidators.passportNumber,
      [FIELDS.passportCode]: FormValidators.passportCode,
      [FIELDS.registrationIndex]: FormValidators.index,
    })
  }, [])

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    forceUpdate()
  }, [initialValues])

  const onClickPersonal = useCallback((event: MouseEvent<HTMLDivElement>) => {
    stopPropagationEvent(event)
  }, [])

  const getSelector = useCallback(
    (caption: string, key: string) => ({
      [key]: {
        fieldType: FIELD_TYPES.selector,
        caption,
        items: getSelectorOptions(
          Object.values(collections[key]?.types || {}),
          (id) => collections[key]?.titles[id] || id,
        ),
      },
    }),
    [collections],
  )

  const blocks = useMemo(
    () => ({
      ...getPersonal('Личная информация', '', genders),
      [FIELDS.agree]: {
        fieldType: FIELD_TYPES.checkbox,
        label: 'Клиент дает согласие на ',
        renderAfterLabel: () => (
          <Text Component="span" primary onClick={onClickPersonal}>
            {'обработку персональных данных'}
          </Text>
        ),
      },
      profession: { fieldType: FIELD_TYPES.title, text: 'Профессиональная деятельность' },
      profession_row_1: {
        blocks: {
          ...getSelector('Образование', FIELDS.education),
          ...getSelector('Социальный статус', FIELDS.status),
          [FIELDS.workName]: {
            fieldType: FIELD_TYPES.input,
            caption: 'Юридическое название места работы',
          },
        },
      },
      profession_row_2: {
        blocks: {
          [FIELDS.position]: {
            fieldType: FIELD_TYPES.input,
            caption: 'Название должности',
          },
          ...getSelector('Стаж работы', FIELDS.experience),
          ...getSelector('Тип должности', FIELDS.positionType),
        },
      },
      profession_row_3: {
        blocks: {
          [FIELDS.officePhone]: {
            fieldType: FIELD_TYPES.input,
            format: MASKS.phone,
            caption: 'Телефон офиса',
          },
          [FIELDS.salary]: getCurrencyInput(
            'Ежемесячный доход',
            'Обращаем внимание, что платеж по кредиту не должен превышать третью часть вашего дохода',
          ),
        },
      },
      family: { fieldType: FIELD_TYPES.title, text: 'Семейное положение' },
      family_row: {
        blocks: {
          ...getSelector('Семейное положение', FIELDS.familyStatus),
          [FIELDS.children]: getNumberInput('Дети до 21 года', 10),
          [FIELDS.dependents]: getNumberInput('Кол-во иждивенцев', 20),
        },
      },
      ...getPersonal('Доверенное лицо', 'proxy'),
      passport: { fieldType: FIELD_TYPES.title, text: 'Паспортные данные' },
      passport_row_1: {
        blocks: {
          [FIELDS.passportNumber]: {
            fieldType: FIELD_TYPES.input,
            format: MASKS.passportNumber,
            caption: 'Серия и номер',
          },
          [FIELDS.passportDate]: getDateInput('Дата выдачи'),
          [FIELDS.passportCode]: {
            fieldType: FIELD_TYPES.input,
            format: MASKS.passportCode,
            caption: 'Код подразделения',
          },
        },
      },
      passport_row_2: {
        blocks: {
          [FIELDS.passportIssuedBy]: {
            fieldType: FIELD_TYPES.input,
            caption: 'Кем выдан',
          },
          [FIELDS.birthPlace]: {
            fieldType: FIELD_TYPES.input,
            caption: 'Место рождения',
          },
        },
      },
      [FIELDS.registration]: { fieldType: FIELD_TYPES.title, text: 'Адрес регистрации' },
      [FIELDS.registrationAddress]: { fieldType: FIELD_TYPES.input, caption: 'Адрес' },
      registration_row: {
        blocks: {
          [FIELDS.registrationIndex]: {
            fieldType: FIELD_TYPES.input,
            format: MASKS.index,
            caption: 'Индекс',
          },
          [FIELDS.registrationDate]: getDateInput('Дата регистрации'),
          ...getSelector('Статус недвижимости', FIELDS.registrationStatus),
        },
      },
      [FIELDS.registrationMatches]: {
        fieldType: FIELD_TYPES.checkbox,
        label: 'Совпадает с адресом проживания',
      },
      payment: { fieldType: FIELD_TYPES.title, text: 'Платежи' },
      payment_row: {
        blocks: {
          [FIELDS.requiredPayments]: getCurrencyInput(
            'Обязательные платежи',
            'ЖКХ, мобильная связь, арендные платежи, алименты, учеба и другие регулярные ежемесячные расходы',
          ),
          [FIELDS.repayment]: getCurrencyInput(
            'Погашение кредитов',
            'Сумма ваших ежемесячных платежей по погашению кредитов в банках',
          ),
        },
      },
    }),
    [onClickPersonal, getSelector, genders],
  )

  const onSubmit = useCallback(
    (values: FormikValues) => {
      setIsSubmitting(true)

      const selectorFields = Object.keys(collections)

      const newValues = reduce(
        Object.keys(values),
        (acc, key) => {
          const value = values[key]

          acc[key] = selectorFields.includes(key)
            ? collections[key].titles[value]
            : NUMBER_FIELDS.includes(key)
            ? parseNumber(value)
            : value

          return acc
        },
        {},
      )

      sendRequest(newValues)
        .then(() => {
          SnackbarUtils.enqueueSnackbar('Заявка успешно создана', { variant: 'success' })
          navigate(ROUTER_PATHS.CRM)
        })
        .catch((error: HttpResponseError) => {
          setIsSubmitting(false)
          Confirm.showError({ message: 'При создании заявки произошла ошибка', error })
          console.warn(error)
        })
    },
    [setIsSubmitting, navigate, collections],
  )

  const renderBeforeButton = useCallback(
    () => <BackButton withConfirm={false} likeButton onClick={onClickBack} />,
    [onClickBack],
  )

  const token = window.localStorage.getItem('token')
  const from_widget = window.localStorage.getItem('from_widget')

  if (!token && !from_widget && !isAuth) {
    return <Navigate to={ROUTER_PATHS.LOGIN} />
  }

  return (
    <div className={classNames(className)}>
      {isSubmitting && <OverlayPreloader preloaderProps={{ size: 80 }} />}
      <Form
        key={dynamicKey}
        initialValues={initialValues}
        validationSchema={validationSchema}
        className="request-form"
        renderBeforeButton={renderBeforeButton}
        blocks={blocks}
        buttonProps={{ text: 'Создать заявку' }}
        onSubmit={onSubmit}
        withReset={false}
      />
    </div>
  )
}

export default RequestForm
