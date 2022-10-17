import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import classNames from 'classnames'
import lodashSize from 'lodash/size'
import isString from 'lodash/isString'
import Skeleton from '@mui/material/Skeleton'
import Image from 'components/base/image/Image'
import Button from 'components/base/button/Button'
import SvgIcon from 'components/base/icon/SvgIcon'
import { ICONS } from 'assets/icons/icons'
import './avatar.scss'

export type AvatarProps = {
  link?: string,
  canChange?: boolean,
  className?: string,
  size?: 'base' | 'large',
  isFetching?: boolean,
  avatarSize?: number,
  onChangeAvatar: (file: File, url: string) => void,
  onClick?: () => void,
}

const Avatar = (props: AvatarProps) => {
  const {
    link,
    canChange = false,
    className = '',
    size = 'base',
    isFetching = false,
    avatarSize = 48,
    onChangeAvatar,
    onClick,
  } = props

  const inputRef = useRef(null)

  const [url, setUrl] = useState(link)
  const [wasRemoved, setWasRemoved] = useState(false)

  useEffect(() => {
    setUrl(link)
  }, [link])

  const hasImage = lodashSize(url) > 0 || (isString(url) && !wasRemoved)

  const onClickLoad = useCallback(() => inputRef?.current?.click(), [inputRef])

  const onChangeFile = useCallback(
    ({ target }: MouseEvent<HTMLDivElement>) => {
      const file = target.files[0]

      if (!file) {
        return
      }

      const link = URL.createObjectURL(file)

      setUrl(link)
      onChangeAvatar?.(file, link)
    },
    [setUrl, onChangeAvatar],
  )

  const onRemoveFile = useCallback(() => {
    inputRef.current.value = ''
    setUrl('')
    onChangeAvatar?.(null, '')
    setWasRemoved(true)
  }, [setUrl, onChangeAvatar, setWasRemoved, inputRef])

  const getStyle = useCallback(
    (size: number) => ({ width: size, height: size, minWidth: size }),
    [],
  )

  const imageStyle = useMemo(() => getStyle(avatarSize), [avatarSize, getStyle])
  const iconStyle = useMemo(() => getStyle(avatarSize * 0.5), [avatarSize, getStyle])

  return (
    <div className={classNames('avatar-block', className, { [size]: size !== 'base' })}>
      <input ref={inputRef} type="file" onChange={onChangeFile} hidden />
      {isFetching ? (
        <Skeleton width={avatarSize} height={avatarSize} variant="circular" />
      ) : hasImage ? (
        <Image className="avatar" style={imageStyle} src={url} onClick={onClick} />
      ) : (
        <div
          className={classNames('avatar', 'avatar-placeholder')}
          style={imageStyle}
          onClick={onClick}
        >
          <SvgIcon Icon={ICONS.user} style={iconStyle} />
        </div>
      )}
      {canChange && (
        <>
          <Button
            variant="text"
            text={hasImage ? 'Изменить' : 'Загрузить'}
            onClick={onClickLoad}
          />
          {hasImage && <Button variant="text" text="Удалить" onClick={onRemoveFile} />}
        </>
      )}
    </div>
  )
}

export default Avatar
