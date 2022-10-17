import React from 'react'
import classNames from 'classnames'
import Row from 'components/base/row/Row'

export type SliderDotProgressProps = {
  progress?: number,
  total?: number,
  className?: string,
}

const SliderDotProgress = (props: SliderDotProgressProps) => {
  const { progress = 0, total = 0, className = '' } = props

  return (
    <Row className={classNames('slider-dots', className)}>
      {Array.from(Array(total).keys()).map((item) => (
        <div
          key={item}
          className={classNames('slider-dots__item', { active: item === progress })}
        />
      ))}
    </Row>
  )
}

export default SliderDotProgress
