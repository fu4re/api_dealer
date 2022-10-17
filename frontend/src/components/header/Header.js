import React, { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import size from 'lodash/size'
import PopupMenu from 'components/base/popup/PopupMenu'
import Text from 'components/base/text/Text'
import Row from 'components/base/row/Row'
import Avatar from 'components/base/avatar/Avatar'
import HeaderLogo from 'components/header/HeaderLogo'
import Confirm from 'components/base/confirm/Confirm'
import SvgIcon from 'components/base/icon/SvgIcon'
import { ICONS } from 'assets/icons/icons'
import { dataSelector, logout } from 'store/Settings/reducers'
import './header.scss'

const Header = () => {
  const dispatch = useDispatch()

  const data = useSelector(dataSelector)

  const { name = '', surname = '', lastname = '', email = '', avatar = '' } = data || {}

  const blocks = useMemo(
    () => [
      {
        id: 'name',
        text: [surname, name, lastname].filter(Boolean).join(' '),
        icon: ICONS.user,
      },
      { id: 'mail', text: email, icon: ICONS.mail },
    ],
    [surname, name, lastname, email],
  )

  const onLogout = useCallback(() => {
    Confirm.show({
      title: 'Выход',
      message: 'Вы действительно хотите выйти?',
      withCancel: true,
      confirmText: 'Выйти',
      onConfirm: () => {
        dispatch(logout())
        window.localStorage.removeItem('token')
      },
    })
  }, [dispatch])

  const renderListContent = useCallback(
    () => (
      <div className="header__content">
        <div className="header__content-rows">
          {blocks.map(({ text, icon, id }) => (
            <Row key={id} className="header__content-item">
              <SvgIcon Icon={icon} className={id} />
              <Text className="header__content-text">{text}</Text>
            </Row>
          ))}
        </div>
        <Text primary className="header__content-exit" onClick={onLogout}>
          {'Выйти из аккаунта'}
        </Text>
      </div>
    ),
    [blocks, onLogout],
  )

  const renderAvatar = useCallback(
    (onClick: () => void) => {
      const isFetching = size(data) === 0

      return (
        <Avatar
          link={avatar}
          className="header__avatar"
          isFetching={isFetching}
          onClick={isFetching ? void 0 : onClick}
        />
      )
    },
    [avatar, data],
  )

  return (
    <Row horizontal="between" className="header">
      <HeaderLogo />
      <PopupMenu
        renderContent={renderAvatar}
        renderListContent={renderListContent}
        horizontalOrigin="right"
      />
    </Row>
  )
}

export default Header
