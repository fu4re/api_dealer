import React, { useMemo, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { FormikValues } from 'formik'
import Button from 'components/base/button/Button'
import Form from 'components/forms/form/Form'
import OverlayPreloader from 'components/base/preloader/OverlayPreloader'
import Confirm from 'components/base/confirm/Confirm'
import HeaderLogo from 'components/header/HeaderLogo'
import { FIELD_TYPES } from 'components/forms/field/Field'
import { INPUT_TYPES } from 'components/inputs/input/Input'
import { FormValidators } from 'constants/validation'
import { ROUTER_PATHS } from 'constants/router'
import { createValidationSchema } from 'utils/forms/validation'
import { fetchAuth, fetchAuthMe } from 'store/Settings/actions'
import { isAuthSelector } from 'store/Settings/reducers'
import './login.scss'

const LoginForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const isAuth = useSelector(isAuthSelector)

  const initialValues = useMemo(() => ({ email: '', password: '' }), [])

  const validationSchema = useMemo(
    () =>
      createValidationSchema({
        email: FormValidators.email,
        password: FormValidators.required,
      }),
    [],
  )

  const blocks = useMemo(
    () => ({
      email: { fieldType: FIELD_TYPES.input, caption: 'E-mail' },
      password: {
        fieldType: FIELD_TYPES.input,
        type: INPUT_TYPES.PASSWORD,
        caption: 'Пароль',
      },
    }),
    [],
  )

  const onClickRegister = useCallback(() => navigate(ROUTER_PATHS.REGISTER), [navigate])

  const renderAfterButton = useCallback(
    () => (
      <Button
        stretch
        onClick={onClickRegister}
        text="Зарегистрироваться"
        variant="outline"
      />
    ),
    [onClickRegister],
  )

  const onSubmit = useCallback(
    async (values: FormikValues) => {
      setIsSubmitting(true)

      const { payload, error } = await dispatch(fetchAuth(values))

      if (payload) {
        if ('token' in payload) {
          window.localStorage.removeItem('from_widget')
          window.localStorage.setItem('token', payload.token)
          dispatch(fetchAuthMe())
        }
      } else {
        Confirm.showError({ message: 'Не удалось авторизоваться', error })
        setIsSubmitting(false)
      }
    },
    [dispatch, setIsSubmitting],
  )

  const renderLogo = useCallback(() => <HeaderLogo className="login-form__logo" />, [])

  if (window.localStorage.getItem('token') && isAuth) {
    return <Navigate to={ROUTER_PATHS.HOME} />
  }

  return (
    <>
      {isSubmitting && <OverlayPreloader preloaderProps={{ size: 80 }} />}
      <Form
        initialValues={initialValues}
        validationSchema={validationSchema}
        className="login-form"
        blocks={blocks}
        buttonProps={{ text: 'Войти', stretch: true }}
        renderAfterButton={renderAfterButton}
        onSubmit={onSubmit}
        withReset={false}
        title="Личный кабинет"
        renderBeforeTitle={renderLogo}
      />
    </>
  )
}

export default LoginForm
