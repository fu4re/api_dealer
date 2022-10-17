import React, { useState, useCallback, useRef, ReactNode } from 'react'
import classNames from 'classnames'
import DropList from 'components/base/droplist/DropList'
import SvgIcon from 'components/base/icon/SvgIcon'
import { ICONS } from 'assets/icons/icons'
import { stopPropagationEvent } from 'utils/common'
import type {
  DropListClickItemType,
  DropListItemType,
} from 'components/base/droplist/DropList'
import './popup.scss'

export type PopupMenuProps = {
  onClickItem?: DropListClickItemType,
  items?: Array<DropListItemType>,
  renderContent?: () => ReactNode,
  renderListContent?: () => ReactNode,
  horizontalOrigin?: 'left' | 'right',
}

const PopupMenu = (props: PopupMenuProps) => {
  const {
    onClickItem,
    items = [],
    renderContent,
    renderListContent,
    horizontalOrigin,
  } = props

  const toggleRef = useRef()

  const [isOpen, setIsOpen] = useState(false)

  const toggle = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      stopPropagationEvent(event)
      setIsOpen((p) => !p)
    },
    [setIsOpen],
  )

  const close = useCallback(() => setIsOpen(false), [setIsOpen])

  const onClickMenuItem = useCallback(
    (...args) => {
      setIsOpen(false)
      onClickItem?.(...args)
    },
    [setIsOpen, onClickItem],
  )

  return (
    <div className={classNames('popup-menu', { active: isOpen })} ref={toggleRef}>
      {renderContent?.(toggle) ?? <SvgIcon Icon={ICONS.dots} onClick={toggle} />}
      <DropList
        open={isOpen}
        items={items}
        onClickMenuItem={onClickMenuItem}
        onClose={close}
        maxHeight={400}
        anchorEl={toggleRef.current}
        renderContent={renderListContent}
        horizontalOrigin={horizontalOrigin}
      />
    </div>
  )
}

export default PopupMenu
