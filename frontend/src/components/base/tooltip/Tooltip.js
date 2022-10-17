import React from 'react'
import CoreTooltip from '@material-ui/core/Tooltip/Tooltip'
import Zoom from '@mui/material/Zoom'
import { PopperPlacementType } from '@material-ui/core/Popper'
import SvgIcon from 'components/base/icon/SvgIcon'
import { replaceWithHtml } from 'utils/common'
import type { TooltipProps as CoreTooltipProps } from '@material-ui/core/Tooltip/Tooltip'
import './tooltip.scss'

export type TooltipProps = {
  className?: string,
  textToReplace?: string,
} & CoreTooltipProps

export type TooltipPlacement = PopperPlacementType

const Tooltip = (props: TooltipProps) => {
  const icons = {}

  const {
    className = '',
    title,
    children,
    textToReplace,
    placement = 'bottom',
    ...other
  } = props

  if (!title) {
    return children
  }

  const iconToReplace = icons[textToReplace]
  const needReplace = Boolean(iconToReplace) && Boolean(textToReplace)

  return (
    <CoreTooltip
      arrow
      disableFocusListener
      TransitionComponent={Zoom}
      enterTouchDelay={0}
      leaveTouchDelay={10000}
      classes={{
        popper: ['tooltip', className].join(' '),
        tooltip: 'tooltip__container',
      }}
      placement={placement}
      {...other}
      title={
        <div>
          {needReplace
            ? replaceWithHtml(
                title,
                textToReplace,
                <SvgIcon className="tooltip__icon" Icon={iconToReplace} />,
              )
            : title}
        </div>
      }
    >
      {children}
    </CoreTooltip>
  )
}

export default Tooltip
