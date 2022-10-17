import React, { useCallback } from 'react'
import classNames from 'classnames'
import isNil from 'lodash/isNil'
import Text from 'components/base/text/Text'
import SvgIcon from 'components/base/icon/SvgIcon'
import Confirm from 'components/base/confirm/Confirm'
import { ICONS } from 'assets/icons/icons'
import { stopPropagationEvent, isMobile } from 'utils/common'
import './box.scss'

export type ItemBoxProps = {
  className?: string,
  item: any,
  onClickItem?: (item: any, index: number) => void,
  onClickRemove?: (item: any, index: number, event: any) => void,
  defaultTitle?: string,
  index?: number,
  activeItemIndex?: number,
  active?: boolean,
  disabled?: boolean,
  invalid?: boolean,
  withConfirm?: boolean,
}

const ItemBox = (props: ItemBoxProps) => {
  const {
    className = '',
    item,
    index,
    activeItemIndex,
    onClickItem,
    onClickRemove,
    defaultTitle = '',
    active = false,
    disabled = false,
    invalid = false,
    withConfirm = false,
    ...other
  } = props

  const _onClickItem = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      stopPropagationEvent(event)
      onClickItem?.(item, index)
    },
    [onClickItem, item, index],
  )

  const _onClickRemove = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      stopPropagationEvent(event)
      const callback = () => onClickRemove(item, index, event)
      withConfirm ? Confirm.showRemove({ onConfirm: callback }) : callback()
    },
    [onClickRemove, item, index, withConfirm],
  )

  const isActive = active || (!isNil(activeItemIndex) && activeItemIndex === index)

  if (!item) {
    return null
  }

  // Исправляет удаление плашки из мультиселекта на мобильных устройствах
  const handler = isMobile ? 'onTouchStart' : 'onMouseDown'

  return (
    <div
      {...other}
      onClick={_onClickItem}
      className={classNames('item-box', className, {
        'item-box--active': isActive,
        'item-box--disabled': disabled,
        'item-box--invalid': invalid,
        'item-box--clickable': Boolean(onClickItem),
      })}
    >
      {item.hasIcon && <SvgIcon Icon={ICONS[item.id]} className="item-box__icon" />}
      <Text className="item-box__text">{item.displayname || defaultTitle}</Text>
      {Boolean(onClickRemove) && !disabled && (
        <SvgIcon
          Icon={ICONS.close}
          className="item-box__remover"
          {...{ [handler]: _onClickRemove }}
        />
      )}
    </div>
  )
}

export default ItemBox
