import React from 'react'
import classNames from 'classnames'
import Text from 'components/base/text/Text'
import BackButton from 'components/buttons/back/BackButton'
import Row from 'components/base/row/Row'
import './text.scss'

export type TitleProps = {
  className?: string,
  text?: string,
  withBack?: Boolean,
  onBackClick?: () => void,
}

const Title = (props: TitleProps) => {
  const { text = '', className = '', withBack = false, onBackClick } = props

  return withBack ? (
    <Row className={classNames('text-title', className)}>
      <BackButton withConfirm onClick={onBackClick} />
      <Text variant="xxl">{text}</Text>
    </Row>
  ) : (
    <Text variant="xxl" className={classNames('text-title', className)}>
      {text}
    </Text>
  )
}

export default Title
