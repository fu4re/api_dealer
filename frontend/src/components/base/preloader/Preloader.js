import React from 'react'
import classNames from 'classnames'
import './preloader.scss'

export type PreloaderProps = {
  className?: string,
  isStatic?: boolean,
  isBase?: boolean,
  size?: number,
}

const Preloader = (props: PreloaderProps) => {
  const { className = '', isStatic = false, isBase = false, size = 24 } = props

  const style = isBase ? { margin: `${size}px ${-size / 2}px 0 ${size / 2}px` } : {}

  return (
    <div
      style={{ width: size, height: size, ...style }}
      className={classNames(
        'preloader',
        className,
        isBase
          ? 'preloader--base'
          : isStatic
          ? 'preloader--static'
          : 'preloader--absolute',
      )}
    >
      {Array.from(Array(10).keys()).map((_, index) => (
        <div key={index + 1} />
      ))}
    </div>
  )
}

export default Preloader
