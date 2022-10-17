import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useImperativeHandle,
  useState,
  useMemo,
} from 'react'
import { LightBox } from 'react-lightbox-pack'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperClass, SwiperOptions, Pagination } from 'swiper'
import size from 'lodash/size'
import classNames from 'classnames'
import Preloader from 'components/base/preloader/Preloader'
import SliderControls from 'components/slider/SliderControls'
import Text from 'components/base/text/Text'
import SvgIcon from 'components/base/icon/SvgIcon'
import { getPath } from 'network/apiPaths'
import { ICONS } from 'assets/icons/icons'
import { useSliderProgress } from 'utils/hooks'
import 'swiper/css'
import 'swiper/css/pagination'
import './slider.scss'

export type BaseSliderProps = {
  className?: string,
  swiperClassName?: string,
  items: Array<any>,
  isFetching?: boolean,
  renderItem: (item: any, index: number, slidesCount: number) => ReactNode,
  breakPoints: {
    [width: number]: SwiperOptions,
    [ratio: string]: SwiperOptions,
  },
  renderAfterSlide?: (slide: any, index: number) => ReactNode,
  renderAtEnd?: (slide: any, index: number) => ReactNode,
  defaultSlidesPerView?: number,
  noTouchMove?: boolean,
  onSwiper?: (swiper: SwiperClass) => void,
  onSlideChange?: (progress: number) => void,
  updateTotal?: (total: number) => void,
  autoplay?: boolean,
  hasPagination?: boolean,
  isCentered?: boolean,
  isInfinity?: boolean,
  hasFullScreen?: boolean,
  autoHeight?: boolean,
  spaceBetween?: number,
  passProps?: Record<string, any>,
}

const BaseSlider = (props: BaseSliderProps, ref: Ref) => {
  const {
    className = '',
    swiperClassName = '',
    items,
    isFetching = false,
    renderItem,
    breakPoints,
    renderAfterSlide,
    renderAtEnd,
    defaultSlidesPerView = 1,
    noTouchMove = false,
    onSwiper,
    onSlideChange: onSlideChangeProp,
    autoplay = false,
    hasPagination = false,
    isCentered = false,
    isInfinity = false,
    hasFullScreen = false,
    autoHeight = false,
    spaceBetween = 45,
    updateTotal,
    passProps = {},
    ...other
  } = props

  const params = { onSlideChange: onSlideChangeProp }
  const { progress, onSlideChange } = useSliderProgress(params)

  const [swiper, setSwiper] = useState(null)
  const [totalPagination, setTotalPagination] = useState(0)
  const [isFull, setIsFull] = useState(false)
  const [index, setIndex] = useState(progress)

  const isMulti = size(items) > 1

  const _onSwiper = useCallback(
    (data: SwiperClass) => {
      onSwiper?.(data)
      setSwiper(data)
    },
    [onSwiper],
  )

  useImperativeHandle(ref, () => ({
    slideTo: (index: number) => swiper?.slideTo(index),
  }))

  const withPagination = hasPagination && isMulti
  const pagination = useMemo(
    () =>
      withPagination && {
        clickable: true,
        renderBullet: (index: number, className: string) => {
          setTotalPagination(index + 1)
          updateTotal?.(index + 1)
          return `<div class="${className}"></div>`
        },
      },
    [setTotalPagination, updateTotal, withPagination],
  )

  const onClickFullScreen = useCallback(
    (isFull: boolean) => {
      setIsFull(isFull)
      setIndex(progress)
    },
    [progress, setIsFull, setIndex],
  )

  return (
    <>
      <div className={classNames('slider', className)}>
        {isFetching ? (
          <Preloader />
        ) : size(items) === 0 ? (
          <Text>{'Нет блоков'}</Text>
        ) : (
          <div className={classNames('slider__container', swiperClassName)}>
            <Swiper
              className="swiper"
              onSwiper={_onSwiper}
              onSlideChange={onSlideChange}
              breakpoints={breakPoints}
              slidesPerView={defaultSlidesPerView}
              spaceBetween={spaceBetween}
              allowTouchMove={!noTouchMove}
              autoplay={autoplay}
              modules={[Pagination]}
              pagination={pagination}
              centeredSlides={isCentered}
              loop={isInfinity}
              autoHeight={autoHeight}
              {...other}
            >
              {items?.map((item, index) => (
                <SwiperSlide key={['Slide', index].join('_')} className="swiper__slide">
                  {renderItem(item, index, items ? size(items) : 0, passProps)}
                  {renderAfterSlide?.(item, index)}
                </SwiperSlide>
              ))}
              {renderAtEnd?.(items[progress], progress)}
              {hasFullScreen && (
                <div className="fullScreen" onClick={() => onClickFullScreen(true)}>
                  <SvgIcon Icon={ICONS.maximize} />
                </div>
              )}
            </Swiper>
            {withPagination && (
              <SliderControls
                className="swiper__controls"
                swiper={swiper}
                total={totalPagination}
                progress={progress}
              />
            )}
          </div>
        )}
      </div>
      {hasFullScreen && (
        <div>
          <LightBox
            state={isFull}
            event={onClickFullScreen}
            data={items.map((el, index) => ({
              ...el,
              id: index,
              image: getPath([window.location.origin, 'assets', 'images', el.image]),
            }))}
            thumbnailHeight={60}
            thumbnailWidth={60}
            setImageIndex={setIndex}
            imageIndex={index}
          />
        </div>
      )}
    </>
  )
}

export default forwardRef(BaseSlider)
