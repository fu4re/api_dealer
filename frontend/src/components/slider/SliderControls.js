import React from 'react'
import { Swiper as SwiperClass } from 'swiper'
import classNames from 'classnames'
import isFinite from 'lodash/isFinite'
import SliderControl from 'components/slider/SliderControl'
import SliderNumProgress from 'components/slider/SliderNumProgress'
import Row from 'components/base/row/Row'
import './slider.scss'

export type SliderControlsProps = {
  className?: string,
  swiper: SwiperClass | null,
  total: number,
  progress?: number,
  progressClassName?: string,
}

const SliderControls = (props: SliderControlsProps) => {
  const { className = '', swiper, total = 0, progress, progressClassName = '' } = props

  const hasProgress = isFinite(progress) && isFinite(total)

  return (
    <Row horizontal={hasProgress ? 'between' : 'right'} className={className}>
      {hasProgress && (
        <SliderNumProgress
          className={classNames('slider__progress', progressClassName)}
          index={progress + 1}
          total={total}
        />
      )}
      <Row>
        <SliderControl swiper={swiper} />
        <SliderControl swiper={swiper} isNext />
      </Row>
    </Row>
  )
}

export default SliderControls
