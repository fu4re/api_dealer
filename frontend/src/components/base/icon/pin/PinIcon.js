import React, { useCallback, useMemo } from 'react'
import classNames from 'classnames'
import Tooltip from 'components/base/tooltip/Tooltip'
import SvgIcon from 'components/base/icon/SvgIcon'
import { ICONS } from 'assets/icons/icons'
import { stopPropagationEvent } from 'utils/common'
import type { SvgIconType } from 'components/base/icon/SvgIcon'
import './pin.scss'

export type PinIconProps = {
  callbackData?: Record<string, any>,
  icon?: null | SvgIconType,
  isActive?: boolean,
  onClick?: (callbackData: Record<string, any>) => void,
}

const PinIcon = (props: PinIconProps) => {
  const { icon = ICONS.pin, isActive = false, onClick, callbackData = {} } = props

  const onClickPin = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      stopPropagationEvent(event)
      onClick?.(callbackData)
    },
    [onClick, callbackData],
  )

  const pin = useMemo(
    () => (
      <div className={classNames('pin-icon', { active: isActive })} onClick={onClickPin}>
        <SvgIcon Icon={icon} />
      </div>
    ),
    [icon, isActive, onClickPin],
  )

  return onClick ? (
    <Tooltip title="Закрепить" placement="right">
      {pin}
    </Tooltip>
  ) : (
    pin
  )
}

export default PinIcon
