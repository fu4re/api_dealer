import Confirm from 'components/base/confirm/Confirm'
import SnackbarUtils from 'config/snackbars/snackbarConfig'
import { restoreItems, archiveItems } from 'network/requests'
import type { HttpResponseError } from 'network/HttpClient'

export const onArchiveClick = (params: Record<string, any>) => {
  const {
    ids = [],
    isArchive = false,
    onBeforeAction,
    onAfterAction,
    onArchiveAction,
  } = params

  const callback = isArchive ? restoreItems : archiveItems

  onBeforeAction?.()

  callback({ ids })
    .then(() => {
      onArchiveAction?.()
      SnackbarUtils.enqueueSnackbar(
        ['Заявки успешно', isArchive ? 'восстановлены' : 'архивированы'].join(' '),
        { variant: 'success' },
      )
    })
    .catch((error: HttpResponseError) => {
      Confirm.showError({
        message: [
          'При',
          isArchive ? 'восстановлении' : 'архивации',
          'заявок произошла ошибка',
        ].join(' '),
        error,
      })
      console.warn(error)
    })
    .finally(() => onAfterAction?.())
}
