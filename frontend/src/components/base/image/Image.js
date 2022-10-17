import React, { CSSProperties } from 'react'
import size from 'lodash/size'
import classNames from 'classnames'

export type ImageProps = {
  className?: string,
  src: string,
  alt?: string,
  style?: CSSProperties,
}

const Image = (props: ImageProps) => {
  const { className = '', src = '', alt = '', style = {}, ...other } = props

  return size(src) > 0 ? (
    <img className={classNames(className)} src={src} alt={alt} style={style} {...other} />
  ) : null
}

export default Image
