import React, { useMemo, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { FormikValues } from 'formik'
import omit from 'lodash/omit'
import trim from 'lodash/trim'
import Avatar from 'components/base/avatar/Avatar'
import Confirm from 'components/base/confirm/Confirm'
import OverlayPreloader from 'components/base/preloader/OverlayPreloader'
import Button from 'components/base/button/Button'
import Form from 'components/forms/form/Form'
import HeaderLogo from 'components/header/HeaderLogo'
import { FIELD_TYPES } from 'components/forms/field/Field'
import { INPUT_TYPES } from 'components/inputs/input/Input'
import { FormValidators } from 'constants/validation'
import { ROUTER_PATHS } from 'constants/router'
import { REGISTER_FIELDS } from 'constants/fields'
import { fetchRegister, fetchAuthMe } from 'store/Settings/actions'
import { isAuthSelector } from 'store/Settings/reducers'
import { getInitialValues } from 'utils/common'
import { createValidationSchema } from 'utils/forms/validation'
import type { FormikType } from 'utils/forms/utils'
import './register.scss'

const RegisterForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const isAuth = useSelector(isAuthSelector)

  const [avatar, setAvatar] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const initialValues = useMemo(() => getInitialValues('', REGISTER_FIELDS), [])

  const validationSchema = useMemo(
    () =>
      createValidationSchema({
        name: FormValidators.required,
        surname: FormValidators.required,
        email: FormValidators.email,
        password: FormValidators.password,
        repeatPassword: FormValidators.repeatPassword,
      }),
    [],
  )

  const onClickLogin = useCallback(() => navigate(ROUTER_PATHS.LOGIN), [navigate])
  const onChangeAvatar = useCallback((file: File) => setAvatar(file), [setAvatar])

  const avatarBlock = useMemo(
    () => ({
      renderContent: (key: string, _: FormikType, className: string) => (
        <Avatar
          key={key}
          className={className}
          canChange
          avatarSize={150}
          onChangeAvatar={onChangeAvatar}
        />
      ),
    }),
    [onChangeAvatar],
  )

  const renderBeforeButton = useCallback(
    () => (
      <Button stretch onClick={onClickLogin} text="Войти в аккаунт" variant="outline" />
    ),
    [onClickLogin],
  )

  const onSubmit = useCallback(
    async (values: FormikValues) => {
      setIsSubmitting(true)

      const { name, surname, lastname } = values

      const excludedKeys = ['repeatPassword', 'name', 'surname', 'lastname']

      const resultData = {
        ...omit(values, excludedKeys),
        file: avatar,
        name: trim(name),
        surname: trim(surname),
        lastname: trim(lastname),
      }

      const { payload, error } = await dispatch(fetchRegister(resultData))

      if (payload) {
        if ('token' in payload) {
          window.localStorage.removeItem('from_widget')
          window.localStorage.setItem('token', payload.token)
          dispatch(fetchAuthMe())
        }
      } else {
        Confirm.showError({ message: 'Не удалось зарегистрироваться', error })
        setIsSubmitting(false)
      }
    },
    [avatar, setIsSubmitting, dispatch],
  )

  const blocks = useMemo(
    () => ({
      avatar: avatarBlock,
      row_1: {
        blocks: {
          name: { fieldType: FIELD_TYPES.input, caption: 'Имя' },
          email: { fieldType: FIELD_TYPES.input, caption: 'E-mail' },
        },
      },
      row_2: {
        blocks: {
          surname: { fieldType: FIELD_TYPES.input, caption: 'Фамилия' },
          password: {
            fieldType: FIELD_TYPES.input,
            type: INPUT_TYPES.PASSWORD,
            caption: 'Пароль',
          },
        },
      },
      row_3: {
        blocks: {
          lastname: {
            fieldType: FIELD_TYPES.input,
            caption: 'Отчество',
            isRequired: false,
          },
          repeatPassword: {
            fieldType: FIELD_TYPES.input,
            type: INPUT_TYPES.PASSWORD,
            caption: 'Повторите пароль',
          },
        },
      },
    }),
    [avatarBlock],
  )

  const renderLogo = useCallback(() => <HeaderLogo />, [])

  if (window.localStorage.getItem('token') && isAuth) {
    return <Navigate to={ROUTER_PATHS.HOME} />
  }

  return (
    <>
      {isSubmitting && <OverlayPreloader preloaderProps={{ size: 80 }} />}
      <Form
        initialValues={initialValues}
        validationSchema={validationSchema}
        className="register-form"
        blocks={blocks}
        buttonProps={{ text: 'Зарегистрироваться' }}
        renderBeforeButton={renderBeforeButton}
        onSubmit={onSubmit}
        withReset={false}
        title="Регистрация"
        renderAtTitleEnd={renderLogo}
      />
    </>
  )
}

export default RegisterForm
