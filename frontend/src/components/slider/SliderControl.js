import React, { useCallback } from 'react'
import { Swiper as SwiperClass } from 'swiper'
import classNames from 'classnames'
import SvgIcon from 'components/base/icon/SvgIcon'
import { ICONS } from 'assets/icons/icons'
import './slider.scss'

export type SliderControlProps = {
  className?: string,
  swiper: SwiperClass | null,
  isNext?: boolean,
}

const SliderControl = (props: SliderControlProps) => {
  const { className = '', swiper, isNext = false } = props

  const onClick = useCallback(
    () => swiper && (isNext ? swiper.slideNext() : swiper.slidePrev()),
    [swiper, isNext],
  )

  return (
    <SvgIcon
      className={classNames('slider__control', className, { next: isNext })}
      Icon={ICONS.arrowLeft}
      onClick={onClick}
    />
  )
}

export default SliderControl
