import React, { ReactNode } from 'react'
import classNames from 'classnames'
import Image from 'components/base/image/Image'
import Text from 'components/base/text/Text'
import empty from 'assets/images/empty.png'
import './no-items.scss'

export type NoItemsCardProps = {
  title?: string,
  className?: string,
  renderAtEnd?: () => ReactNode,
}

const NoItemsCard = (props: NoItemsCardProps) => {
  const { title = '', className = '', renderAtEnd } = props

  return (
    <div className={classNames('no-items', className)}>
      <Image src={empty} className="no-items__image" />
      <Text center variant="xxl" className="no-items__title">
        {title}
      </Text>
      {renderAtEnd?.()}
    </div>
  )
}

export default NoItemsCard
