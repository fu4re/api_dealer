import React from 'react'
import get from 'lodash/get'
import isPlainObject from 'lodash/isPlainObject'
import SnackbarUtils from 'config/snackbars/snackbarConfig'
import Button from 'components/base/button/Button'
import Confirm from 'components/base/confirm/Confirm'
import { ICONS } from 'assets/icons/icons'
import { getPath } from 'network/apiPaths'

export const GLOBAL_API_CONFIG = {
  redirectCodes: null,
  redirectLink: getPath([window.location.origin, 'login']),
}

export const alertApiError = (message: string, exception: string) => {
  if (message) {
    Confirm.showError({
      title: 'Ошибка API',
      message: [message, exception || ''].filter(Boolean).join('\n'),
    })
  }
}

export const maybeRedirect = (status: number) => {
  const statuses = GLOBAL_API_CONFIG.redirectCodes || [401]

  if (statuses.includes(status)) {
    const link = getRedirectLink()

    if (link && link !== window.location.href) {
      window.location.href = link
      return true
    }
  }

  return false
}

export const getRedirectLink = () => {
  const link = GLOBAL_API_CONFIG.redirectLink
  return link?.replace('%REDIRECT%', encodeURIComponent(window.location.href)) ?? null
}

export const networkLog = (
  type: string,
  method: string,
  url: string,
  success: boolean | null,
  ...args
) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `%c[${type}][${method}](${url})`,
      `color: ${success === true ? 'green' : success === false ? 'red' : 'blue'}`,
      ...args,
    )
  }
}

export const isSuccessResponse = (response) => {
  const answer = get(response, 'data.writer.agAnswer') || get(response, 'data.agAnswer')
  return answer === 'OK'
}

export const processPushMessage = (response) => {
  const _get = (path: string) => get(response.data, path)
  const pushMessage = _get('pushmessage') || _get('writer.pushmessage')

  if (pushMessage) {
    const { text, variant, can_hide, hide_duration, anchor_origin, background_color } =
      pushMessage

    SnackbarUtils.enqueueSnackbar(<div className="push__content">{text}</div>, {
      variant,
      autoHideDuration: hide_duration,
      persist: hide_duration === 0,
      anchorOrigin: anchor_origin,
      ContentProps: background_color && {
        className: 'push',
        style: { backgroundColor: background_color },
      },
      action: can_hide
        ? (key) => (
            <Button
              onClick={() => SnackbarUtils.closeSnackbar(key)}
              iconStart={ICONS.close}
            />
          )
        : null,
    })
  }
}

export const prepareParams = (params: Record<string, any> = {}) => {
  return isPlainObject(params) ? params : {}
}

export const processNotAuthorizedResponse = (data) => {
  if (data?.includes?.('<html>')) {
    let resultHtml = data?.replace(
      /name="RedirectTo" value=".*"/,
      `name="RedirectTo" value="${window.location.href}"`,
    )

    // Скрываем MUI-порталы в HTML (не найден другой способ)
    resultHtml = resultHtml?.replace(
      '</head>',
      '<style>.MuiTooltip-popper,[role="presentation"]{display:none!important;}</style></head>',
    )

    const newHTML = document.open('text/html', 'replace')
    newHTML.write(resultHtml)
    newHTML.close()

    // Выбрасываем ошибку, чтобы запрос считался не успешным
    throw new Error('Not authorized')
  }

  return false
}
