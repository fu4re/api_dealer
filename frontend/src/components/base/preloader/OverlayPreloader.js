import React from 'react'
import classNames from 'classnames'
import Preloader from './Preloader'
import './preloader.scss'

export type OverlayPreloaderProps = {
  className?: string,
  showSpinner?: boolean,
  backgroundAlpha?: number,
  preloaderProps?: Record<string, any>,
}

const OverlayPreloader = (props: OverlayPreloaderProps) => {
  const {
    className = '',
    showSpinner = true,
    backgroundAlpha = 0.6,
    preloaderProps = {},
    ...other
  } = props

  return (
    <div
      {...other}
      style={{ opacity: backgroundAlpha }}
      className={classNames('overlay-preloader', className)}
    >
      {showSpinner ? <Preloader {...preloaderProps} /> : null}
    </div>
  )
}

export default OverlayPreloader
