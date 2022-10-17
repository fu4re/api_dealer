import React, { useState, useCallback } from 'react'
import classNames from 'classnames'
import Row from 'components/base/row/Row'
import Text from 'components/base/text/Text'
import './tabs.scss'

export type TabItemType = {
  id: string,
  text: string,
}

export type TabsProps = {
  activeTab?: number | string,
  tabs?: Array<TabItemType>,
  renderContent: Record<string, any>,
  className?: string,
  onChangeTab?: (name: string) => void,
}

const Tabs = (props: TabsProps) => {
  const { activeTab, tabs = [], renderContent = {}, className = '', onChangeTab } = props

  const [selected, setSelected] = useState(activeTab ?? tabs[0]?.id)

  const onClickTab = useCallback(
    (id: string) => {
      setSelected(id)
      onChangeTab?.(id)
    },
    [setSelected, onChangeTab],
  )

  const renderTab = useCallback(
    ({ text, id }: TabItemType) => {
      const isActive = id === selected

      return (
        <Row
          key={id}
          className={classNames('tabs__item', { active: isActive })}
          onClick={isActive ? void 0 : () => onClickTab(id)}
        >
          <Text center className="tabs__item-text">
            {text}
          </Text>
        </Row>
      )
    },
    [selected, onClickTab],
  )

  return (
    <div className={classNames('tabs', className)}>
      <Row className="tabs__items">{tabs.map(renderTab)}</Row>
      <div className="tabs__content">{renderContent[selected]}</div>
    </div>
  )
}

export default Tabs
