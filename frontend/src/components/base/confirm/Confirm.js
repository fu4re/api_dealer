import React, { PureComponent, Ref } from 'react'
import size from 'lodash/size'
import omit from 'lodash/omit'
import Text from 'components/base/text/Text'
import Dialog from '@material-ui/core/Dialog'
import Row from 'components/base/row/Row'
import Button from 'components/base/button/Button'
import SvgIcon from 'components/base/icon/SvgIcon'
import { ICONS } from 'assets/icons/icons'
import { replaceLineBreaksWithHtml } from 'utils/common'
import './confirm.scss'

let confirmRef = null

export type ConfirmButtonType = {
  text: string,
  onClick: () => void,
}

export type ConfirmDataType = {
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel: () => void,
  withCancel: boolean,
  confirmText: string,
  cancelText: string,
  buttons?: Array<ConfirmButtonType>,
  withoutCloseOnClickOutside?: boolean,
  error?: string,
}

class Confirm extends PureComponent {
  initialState = {
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: null,
    withCancel: false,
    confirmText: 'Ок',
    cancelText: 'Отмена',
    buttons: null,
    withoutCloseOnClickOutside: false,
    error: '',
  }

  state = { open: false, ...this.initialState }

  close = () => this.setState({ open: false })
  maybeClose = () => !this.state.withoutCloseOnClickOutside && this.close()
  onExited = () => this.setState(this.initialState)

  _onConfirm = () => {
    this.close()
    this.state.onConfirm?.()
  }

  _onCancel = () => {
    this.close()
    this.state.onCancel?.()
  }

  renderButton = ({ onClick, text, ...other }: ConfirmDialogButtonType) => {
    const _onClick = () => {
      this.close()
      onClick()
    }

    return <Button {...other} size="small" stretch onClick={_onClick} text={text} />
  }

  renderButtons = () => {
    const { confirmText, cancelText, onCancel, withCancel, buttons } = this.state

    const showCancel = Boolean(onCancel) || withCancel

    return (
      <div className="confirm__buttons">
        {buttons?.map(this.renderButton) ?? (
          <>
            <Button size="small" onClick={this._onConfirm} text={confirmText} />
            {showCancel && (
              <Button
                size="small"
                onClick={this._onCancel}
                variant="outline"
                text={cancelText}
              />
            )}
          </>
        )}
      </div>
    )
  }

  show = (data: Record<string, any>) => {
    this.setState({ ...this.initialState, open: true, ...data })
  }

  render() {
    const { open, message, title, onCancel, withCancel, error } = this.state

    const hasTitle = size(title) > 0
    const showCancel = Boolean(onCancel) || withCancel
    const hasHeader = hasTitle || showCancel

    return (
      <Dialog
        classes={{ root: 'confirm-root', paper: 'confirm-paper' }}
        open={open}
        onClose={this.maybeClose}
        TransitionProps={{ onExited: this.onExited }}
      >
        <div className="confirm">
          {hasHeader && (
            <Row horizontal="between" className="confirm__header">
              {hasTitle ? <Text type="bold">{title}</Text> : <div />}
              {showCancel && <SvgIcon Icon={ICONS.close} onClick={this._onCancel} />}
            </Row>
          )}
          <div className="confirm__content">
            {size(message) > 0 && <Text className="confirm__message">{message}</Text>}
            {size(error) > 0 && (
              <div
                dangerouslySetInnerHTML={{ __html: error }}
                className="confirm__error"
              />
            )}
            {this.renderButtons()}
          </div>
        </div>
      </Dialog>
    )
  }
}

Confirm.setRef = (ref: Ref) => (confirmRef = ref)

Confirm.show = (data: ConfirmDialogDataType) => confirmRef?.show(data)

Confirm.showNoChanges = (data: ConfirmDialogDataType = {}) => {
  confirmRef.show({ message: 'Вы не внесли изменений', withCancel: true, ...data })
}

Confirm.showHasChanges = (data: ConfirmDialogDataType = {}) => {
  confirmRef.show({
    title: 'Прогресс будет утерян',
    message: 'Вы хотите выйти со страницы, на которой редактировали информацию.',
    confirmText: 'Выйти',
    cancelText: 'Вернуться к редактированию',
    withCancel: true,
    ...data,
  })
}

Confirm.showRemove = (data: ConfirmDialogDataType = {}) => {
  confirmRef.show({
    title: 'Удаление элемента',
    message:
      'Этот элемент будет удален без возможности восстановления. Хотите продолжить?',
    confirmText: 'Удалить',
    cancelText: 'Отмена',
    withCancel: true,
    ...data,
  })
}

Confirm.showError = (data: ConfirmDialogDataType = {}) => {
  const { error, message } = data

  const hasHTML = error?.message?.indexOf('DOCTYPE') !== -1
  const parsed = hasHTML ? {} : JSON.parse(error?.message || '{}')
  const errorMessage = hasHTML
    ? ''
    : parsed?.error || parsed?.errors?.[0]?.message || parsed?.errors?.[0]?.title || ''

  const resultMessage = error
    ? replaceLineBreaksWithHtml([message, errorMessage].filter(Boolean).join(':\n'))
    : message

  confirmRef.show({
    title: 'Ошибка',
    confirmText: 'Закрыть',
    ...omit(data, 'error'),
    ...(hasHTML ? { error: error?.message } : {}),
    message: resultMessage,
  })
}

export default Confirm
