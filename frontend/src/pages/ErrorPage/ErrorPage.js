import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Confirm from 'components/base/confirm/Confirm'

const ErrorPage = () => {
  const navigate = useNavigate()

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    Confirm.showError({
      message:
        'Вы перешли на несуществующую страницу. Вы можете вернуться на предыдущую страницу.',
      confirmText: 'Вернуться назад',
      withoutCloseOnClickOutside: true,
      onConfirm: () => navigate(-1),
    })
  }, [])

  return <></>
}

export default ErrorPage
