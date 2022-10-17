import React, { ReactNode, useEffect, useCallback, useMemo } from 'react'
import size from 'lodash/size'
import classNames from 'classnames'
import Popover from '@material-ui/core/Popover'
import SvgIcon from 'components/base/icon/SvgIcon'
import Tooltip from 'components/base/tooltip/Tooltip'
import Text from 'components/base/text/Text'
import Preloader from 'components/base/preloader/Preloader'
import PinIcon from 'components/base/icon/pin/PinIcon'
import { ICONS } from 'assets/icons/icons'
import { stopPropagationEvent, areDropItemsEqual } from 'utils/common'
import type { PopoverProps } from '@material-ui/core/Popover'
import './droplist.scss'

export type DropListItemType = Record<string, any>

export type DropListItemsType = Array<DropListItemType>

export type DropListClickItemType = (
  result: DropListItemType | DropListItemsType,
  item: DropListItemType,
) => void

export type DropListProps = {
  title?: string,
  doNotUsePopover?: boolean,
  className?: string,
  popoverClassName?: string,
  open: boolean,
  pins?: Array<any>,
  items: DropListItemsType,
  isMulti?: boolean,
  withIcon?: boolean,
  setMaxWidth?: boolean,
  maxHeight?: number,
  noItemsText?: string,
  isFetching?: boolean,
  selectedItem?: DropListItemType,
  pinnedItem?: DropListItemType,
  renderBeforeItems?: () => ReactNode,
  renderAfterItems?: () => ReactNode,
  renderAfterItem?: (item: DropListItemType, index: number) => ReactNode,
  onClickMenuItem: DropListClickItemType,
  onClose?: (event: Event) => void,
  onClickPin?: () => void,
  renderContent?: () => ReactNode,
  renderAtBottom?: () => ReactNode,
} & PopoverProps

const DropList = (props: DropListProps) => {
  const {
    title,
    doNotUsePopover = false,
    className = '',
    popoverClassName,
    open = false,
    pins,
    items = [],
    isMulti = false,
    withIcon = false,
    setMaxWidth,
    maxHeight,
    noItemsText = '',
    isFetching = false,
    selectedItem,
    pinnedItem,
    renderBeforeItems,
    renderAfterItems,
    renderAfterItem,
    onClickMenuItem,
    onClose,
    onClickPin,
    renderContent,
    renderAtBottom,
    anchorEl,
    horizontalOrigin,
  } = props

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (doNotUsePopover) {
      const action = open ? document.addEventListener : document.removeEventListener
      action('click', onClickOutside, true)
    }

    return () => document.removeEventListener('click', onClickOutside, true)
  }, [open])

  const onClickOutside = useCallback(
    (event: MouseEvent<HTMLElement>) => onClose?.(event),
    [onClose],
  )

  const onClickItem = useCallback(
    (
      event: MouseEvent<HTMLDivElement>,
      item: DropListItemType,
      isActive: boolean = false,
    ) => {
      event.preventDefault()
      stopPropagationEvent(event)

      if (isMulti) {
        onClickMenuItem(
          isActive
            ? selectedItem?.filter((i) => i !== item)
            : [...(selectedItem || []), item],
          item,
        )
      } else {
        !isActive && onClickMenuItem(item, item)
      }
    },
    [isMulti, onClickMenuItem, selectedItem],
  )

  const renderMenuItem = useCallback(
    (item: DropListItemType, index: number) => {
      const {
        renderBefore,
        title: itemTitle = '',
        subTitle = '',
        tooltip = '',
        id,
      } = item || {}

      const areEqual = (s) => areDropItemsEqual(s, item)

      const isActive = isMulti
        ? Array.isArray(selectedItem) && selectedItem.find(areEqual)
        : areEqual(selectedItem)

      const _onClick = (event: MouseEvent<HTMLDivElement>) => {
        onClickItem(event, item, isActive)
      }

      const content = (
        <li
          key={id || index}
          onClick={_onClick}
          className={classNames('dropmenu__item', isMulti ? 'multi' : 'single', {
            added: isActive,
          })}
        >
          {renderBefore?.()}
          <div className="dropmenu__item__text">
            {itemTitle && (
              <Text variant="sm" className="dropmenu__item__title">
                {itemTitle}
              </Text>
            )}
            {subTitle && (
              <Text variant="sm" className="dropmenu__item__subtitle">
                {subTitle}
              </Text>
            )}
            {renderAfterItem?.(item, index)}
          </div>
          {(isMulti || withIcon) && (
            <SvgIcon
              Icon={ICONS.check}
              className="dropmenu__item__selected-indicator"
            />
          )}
          {pins && (
            <PinIcon
              callbackData={item}
              isActive={areEqual(pinnedItem)}
              onClick={onClickPin}
            />
          )}
        </li>
      )

      return tooltip ? <Tooltip title={tooltip}>{content}</Tooltip> : content
    },
    [selectedItem, pinnedItem, pins, onClickPin, isMulti, withIcon, renderAfterItem],
  )

  const onBackdropClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      stopPropagationEvent(event)
      onClose?.(event)
    },
    [onClose],
  )

  const containerClassname = useMemo(
    () =>
      classNames('dropmenu', className, {
        'with-icon': isMulti || withIcon,
        'dropmenu--absolute': doNotUsePopover,
        'dropmenu--with-width': setMaxWidth,
      }),
    [className, isMulti, withIcon, doNotUsePopover, setMaxWidth],
  )

  const Component = doNotUsePopover ? 'ul' : Popover
  const horizontal = pins ? 'right' : horizontalOrigin || 'left'

  const listProps = useMemo(
    () =>
      doNotUsePopover
        ? {
            style: {
              display: open ? 'block' : 'none',
              maxHeight,
              overflowY: maxHeight ? 'auto' : '',
            },
            className: containerClassname,
          }
        : {
            open,
            anchorEl,
            onBackdropClick,
            classes: { root: popoverClassName, paper: containerClassname },
            PaperProps: {
              style: {
                minWidth: anchorEl?.offsetWidth,
                maxWidth: setMaxWidth && anchorEl?.offsetWidth,
                maxHeight,
              },
            },
            anchorOrigin: { vertical: 'bottom', horizontal },
            transformOrigin: { vertical: 'top', horizontal },
          },
    [
      doNotUsePopover,
      open,
      maxHeight,
      containerClassname,
      popoverClassName,
      anchorEl,
      onBackdropClick,
      setMaxWidth,
      horizontal,
    ],
  )

  return (
    <Component {...listProps}>
      {Boolean(title) && <Text type="medium">{title}</Text>}
      {renderBeforeItems?.()}
      {renderContent?.() ??
        (size(items) > 0
          ? items.map(renderMenuItem)
          : size(noItemsText) > 0 && (
              <Text className="dropmenu__no-items" center>
                {noItemsText}
              </Text>
            ))}
      {renderAfterItems?.()}
      {renderAtBottom?.()}
      {isFetching && <Preloader />}
    </Component>
  )
}

export default DropList
