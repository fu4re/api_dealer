import React from 'react'
import classNames from 'classnames'
import lodashSize from 'lodash/size'
import Row from 'components/base/row/Row'
import Badge, { BADGE_THEMES, BADGE_SIZES } from 'components/base/badge/Badge'
import type { BadgeProps } from 'components/base/badge/Badge'
import type { ItemType } from 'constants/types'
import './badge.scss'

export type BadgesProps = Partial<BadgeProps> & {
  items?: Array<ItemType>,
  className?: string,
  rowProps?: Record<string, any>,
}

const Badges = (props: BadgesProps) => {
  const {
    items = [],
    size = BADGE_SIZES.small,
    theme = BADGE_THEMES.gray,
    className = '',
    rowProps = {},
    ...other
  } = props

  if (lodashSize(items) === 0) {
    return null
  }

  return (
    <Row
      wrap
      className={classNames('badges', className, { [size]: size !== BADGE_SIZES.base })}
      {...rowProps}
    >
      {items.map(({ id = '', displayname = '' }: ItemType, index) => (
        <Badge
          key={[id, index].join('_')}
          text={displayname}
          theme={theme}
          size={size}
          textProps={{ uppercase: true }}
          {...other}
        />
      ))}
    </Row>
  )
}

export default Badges
