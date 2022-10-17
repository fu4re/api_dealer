import React from 'react'
import Text, { TextProps } from 'components/base/text/Text'
import Row from 'components/base/row/Row'

export type SliderNumProgressProps = {
  index: number,
  total: number,
} & TextProps

const SliderNumProgress = (props: SliderNumProgressProps) => {
  const { index = 0, total = 0, ...other } = props

  const hasProgress = isFinite(index) && isFinite(total)

  if (!hasProgress) {
    return null
  }

  return (
    <Row {...other} className="slider__numbers">
      <Text variant="md">{index}</Text>
      <Text variant="sm" className="total">
        <span className="total__divider">{'/'}</span>
        {total}
      </Text>
    </Row>
  )
}

export default SliderNumProgress
