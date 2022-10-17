import React, {
  useState,
  Ref,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useCallback,
} from 'react'
import classNames from 'classnames'
import Row from 'components/base/row/Row'
import Text from 'components/base/text/Text'
import Rotate from 'components/base/rotate/Rotate'
import DropList from 'components/base/droplist/DropList'
import SvgIcon from 'components/base/icon/SvgIcon'
import { ICONS } from 'assets/icons/icons'
import type {
  DropListItemsType,
  DropListClickItemType,
} from 'components/base/droplist/DropList'
import './selector.scss'

export type SelectorValueType = string | number

export type SelectorProps = {
  theme?: 'base' | 'alt',
  className?: string,
  listClassName?: string,
  rowClassName?: string,
  value: SelectorValueType,
  items?: DropListItemsType,
  onClickMenuItem?: DropListClickItemType,
  valueModifier?: (value: SelectorValueType) => SelectorValueType,
}

const Selector = (props: SelectorProps, ref: Ref) => {
  const {
    theme = 'base',
    className = '',
    listClassName = '',
    rowClassName = '',
    value,
    items = [],
    onClickMenuItem,
    valueModifier,
  } = props

  const [isOpen, setIsOpen] = useState(false)

  const toggleRef = useRef()

  const toggle = useCallback(() => setIsOpen((p) => !p), [setIsOpen])
  const close = useCallback(() => setIsOpen(false), [setIsOpen])

  const _onClickMenuItem = useCallback(
    (...args) => {
      setIsOpen(false)
      onClickMenuItem(...args)
    },
    [setIsOpen, onClickMenuItem],
  )

  useImperativeHandle(
    ref,
    () => ({
      open: () => !isOpen && setIsOpen(true),
    }),
    [isOpen, setIsOpen],
  )

  const selectedItem = useMemo(() => items.find(({ id }) => id === value), [items, value])

  return (
    <div className={classNames('selector', className, { [theme]: theme !== 'base' })}>
      <Row
        onClick={toggle}
        ref={toggleRef}
        className={classNames('selector__row', rowClassName, { active: Boolean(value) })}
        horizontal="between"
      >
        <Text>{valueModifier?.(selectedItem?.title) ?? selectedItem?.title}</Text>
        <Rotate when={isOpen}>
          <SvgIcon Icon={ICONS.chevronDown} />
        </Rotate>
      </Row>
      <DropList
        open={isOpen}
        items={items}
        onClickMenuItem={_onClickMenuItem}
        onClose={close}
        maxHeight={400}
        anchorEl={toggleRef.current}
        selectedItem={selectedItem}
        className={listClassName}
      />
    </div>
  )
}

export default forwardRef(Selector)
