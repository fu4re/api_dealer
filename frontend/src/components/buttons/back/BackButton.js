import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import Confirm from 'components/base/confirm/Confirm'
import Row from 'components/base/row/Row'
import Button from 'components/base/button/Button'
import SvgIcon from 'components/base/icon/SvgIcon'
import { ICONS } from 'assets/icons/icons'
import './back.scss'

export type BackButtonProps = {
  path: string,
  withConfirm?: boolean,
  className?: string,
  forbiddenMessage?: string,
  isForbidden?: boolean,
  likeButton?: boolean,
  onClick?: () => void,
}

const BackButton = (props: BackButtonProps) => {
  const {
    path = '',
    withConfirm = true,
    className = '',
    isForbidden = false,
    likeButton = false,
    forbiddenMessage,
    onClick,
  } = props

  const navigate = useNavigate()

  const onClickBack = useCallback(() => {
    const callback = () => {
      if (isForbidden) {
        Confirm.showError({ message: forbiddenMessage ?? 'Невозможно вернуться назад.' })
        return
      }

      if (onClick) {
        onClick()
        return
      }

      navigate(path || -1)
    }

    withConfirm ? Confirm.showHasChanges({ onConfirm: callback }) : callback()
  }, [navigate, onClick, path, withConfirm, isForbidden, forbiddenMessage])

  return likeButton ? (
    <Button text="Вернуться назад" variant="outline" onClick={onClickBack} />
  ) : (
    <Row className={classNames('back-button', className)} onClick={onClickBack}>
      <SvgIcon Icon={ICONS.arrowLeft} />
    </Row>
  )
}

export default BackButton
