import React, { forwardRef, Ref, useCallback, ReactNode, MouseEvent } from 'react'
import lodashSize from 'lodash/size'
import isFunction from 'lodash/isFunction'
import classNames from 'classnames'
import { PopperPlacementType } from '@material-ui/core/Popper'
import SvgIcon from 'components/base/icon/SvgIcon'
import Tooltip from 'components/base/tooltip/Tooltip'
import Preloader from 'components/base/preloader/Preloader'
import Text from 'components/base/text/Text'
import { stopPropagationEvent } from 'utils/common'
import type { TextProps } from 'components/base/text/Text'
import type { SvgIconType } from 'components/base/icon/SvgIcon'
import './button.scss'

export const BUTTON_SIZES = {
  base: 'base',
  small: 'small',
}

export type ButtonProps = {
  className?: string,
  textClassName?: string,
  iconClassName?: string,
  text?: ReactNode,
  disabled?: boolean,
  isFetching?: boolean,
  isInvert?: boolean,
  stretch?: boolean,
  variant?: 'filled' | 'outline' | 'text',
  theme?: 'base' | 'transparent',
  size?: $Values<typeof BUTTON_SIZES>,
  iconStart?: null | SvgIconType,
  iconEnd?: null | SvgIconType,
  renderAtEnd?: () => ReactNode,
  children?: ReactNode,
  tooltip?: string,
  tooltipPlacement?: PopperPlacementType,
  tooltipEnterDelay?: number,
  tabindex?: string,
  onClick?: (event: MouseEvent<HTMLElement>) => void,
  onClickDisabled?: (event: MouseEvent<HTMLElement>) => void,
  textProps?: TextProps,
}

const Button = (props: ButtonProps, ref: Ref<any>) => {
  const {
    className = '',
    textClassName = '',
    iconClassName = '',
    text = '',
    disabled = false,
    stretch = false,
    isFetching = false,
    variant = 'filled',
    theme = 'base',
    size = 'base',
    iconStart = null,
    iconEnd = null,
    renderAtEnd = null,
    children = null,
    tooltip,
    tooltipPlacement,
    tooltipEnterDelay,
    tabindex = '-1',
    onClick,
    onClickDisabled,
    textProps,
    isInvert = false,
    ...other
  } = props

  const _onClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (disabled) {
        stopPropagationEvent(event)
        onClickDisabled?.(event)
        return
      }

      if (!disabled && !isFetching && isFunction(onClick)) {
        stopPropagationEvent(event)
        onClick?.(event)
      }
    },
    [disabled, isFetching, onClick, onClickDisabled],
  )

  const renderIcon = useCallback(
    (icon: null | SvgIconType, type: 'start' | 'end' = 'start') => {
      return (
        icon &&
        !isFetching && (
          <SvgIcon
            className={classNames('button-icon', `button-icon--${type}`, iconClassName)}
            Icon={icon}
          />
        )
      )
    },
    [isFetching, iconClassName],
  )

  return (
    <Tooltip
      title={isFetching ? '' : tooltip}
      placement={tooltipPlacement}
      enterDelay={tooltipEnterDelay}
    >
      <div
        {...other}
        ref={ref}
        tabIndex={tabindex}
        disabled={disabled || isFetching}
        onClick={_onClick}
        className={classNames('button', className, variant, theme, {
          disabled,
          stretch,
          invert: isInvert,
          fetching: isFetching,
          [size]: size !== 'base',
          'with-text': lodashSize(text) > 0,
        })}
      >
        {renderIcon(iconStart)}
        {isFetching ? (
          <Preloader />
        ) : (
          text && (
            <Text className={classNames('button-text', textClassName)} {...textProps}>
              {text}
            </Text>
          )
        )}
        {renderIcon(iconEnd, 'end')}
        {children}
        {renderAtEnd?.()}
      </div>
    </Tooltip>
  )
}

export default forwardRef(Button)
