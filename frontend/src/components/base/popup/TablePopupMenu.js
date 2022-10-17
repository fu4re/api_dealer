import React, { useCallback, useMemo } from 'react'
import PopupMenu from 'components/base/popup/PopupMenu'
import { TABLE_MENU, TABLE_ITEMS } from 'constants/menu'
import { onArchiveClick } from 'utils/specific'

export type TablePopupMenuProps = {
  ids: Array<number>,
  isArchive?: boolean,
  onBeforeAction?: () => void,
  onAfterAction?: () => void,
  onArchiveAction?: () => void,
}

const TablePopupMenu = (props: TablePopupMenuProps) => {
  const { isArchive = false } = props

  const tableItems = useMemo(() => TABLE_ITEMS(isArchive), [isArchive])

  const onClickMenuItem = useCallback(
    (_, { id }: DropListItemType) => id === TABLE_MENU.archive && onArchiveClick(props),
    [props],
  )

  return <PopupMenu items={tableItems} onClickItem={onClickMenuItem} />
}

export default TablePopupMenu
