import SvgIcon from 'components/base/icon/SvgIcon'
import { ICONS } from 'assets/icons/icons'

export const TABLE_MENU = {
  archive: 'archive',
}

export const TABLE_ITEMS = (isArchive: boolean = false) => [
  {
    id: TABLE_MENU.archive,
    title: isArchive ? 'Восстановить' : 'Архивировать',
    renderBefore: () => <SvgIcon Icon={isArchive ? ICONS.file : ICONS.archive} />,
  },
]
