import React, { useMemo, ReactNode } from 'react'
import lodashSize from 'lodash/size'
import classNames from 'classnames'
import Row from 'components/base/row/Row'
import Text from 'components/base/text/Text'
import './badge.scss'

export const BADGE_THEMES = {
  white: 'white',
}

export const BADGE_SIZES = {
  base: 'base',
  small: 'small',
  middle: 'middle',
}

export type BadgeItemType = {
  text: string,
  theme?: $Values<typeof BADGE_THEMES>,
}

export type BadgeProps = Partial<BadgeItemType> & {
  size?: $Values<typeof BADGE_SIZES>,
  renderAtEnd?: () => ReactNode,
  textProps?: Record<string, any>,
  rounded?: boolean,
}

const Badge = (props: BadgeProps) => {
  const {
    text = '',
    theme = BADGE_THEMES.white,
    size = BADGE_SIZES.base,
    renderAtEnd,
    textProps = {},
    rounded = false,
  } = props

  const hasText = lodashSize(text) > 0
  const hasContent = Boolean(renderAtEnd) || hasText

  const textSettings = useMemo(
    () => ({
      [BADGE_SIZES.base]: { variant: 'md' },
    }),
    [],
  )

  return hasContent ? (
    <Row
      horizontal="between"
      className={classNames('badge', theme, {
        [size]: size !== BADGE_SIZES.base,
        rounded,
      })}
    >
      {hasText && (
        <Text {...textProps} {...textSettings[size]}>
          {text}
        </Text>
      )}
      {renderAtEnd?.()}
    </Row>
  ) : null
}

export default Badge
