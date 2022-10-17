import React from 'react'
import size from 'lodash/size'
import robot from 'assets/images/not-found.png'
import Image from 'components/base/image/Image'
import Text from 'components/base/text/Text'
import './notice.scss'

export type NoticeProps = {
  title?: string,
  subtitle?: string,
}

const Notice = (props: NoticeProps) => {
  const { title = '', subtitle = '' } = props

  return (
    <div className="notice">
      <Image src={robot} className="notice__image" />
      {size(title) > 0 && (
        <Text center variant="lg">
          {title}
        </Text>
      )}
      {size(subtitle) > 0 && (
        <Text center className="notice__text">
          {subtitle}
        </Text>
      )}
    </div>
  )
}

export default Notice
