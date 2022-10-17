import React, { useState, useCallback } from 'react'
import classNames from 'classnames'
import Collapse from '@material-ui/core/Collapse'
import Text from 'components/base/text/Text'
import Rotate from 'components/base/rotate/Rotate'
import SvgIcon from 'components/base/icon/SvgIcon'
import { ICONS } from 'assets/icons/icons'
import { replaceLineBreaksWithHtml } from 'utils/common'
import type { TextProps } from 'components/base/text/TextProps'
import './accordion.scss'

export type AccordionProps = {
  title: string,
  text?: string,
  renderHeader?: () => ReactNode,
  renderContent: () => ReactNode,
  className?: string,
  isChevronCentered?: boolean,
  defaultOpen?: boolean,
  titleProps?: TextProps,
}

const Accordion = (props: AccordionProps) => {
  const {
    title = '',
    text = '',
    renderHeader,
    renderContent,
    className = '',
    isChevronCentered = false,
    defaultOpen = false,
    titleProps = {},
  } = props

  const [isOpen, setIsOpen] = useState(defaultOpen)

  const hasContent = Boolean(text) || Boolean(renderContent)
  const isVisible = (Boolean(title) || Boolean(renderHeader)) && hasContent

  const toggle = useCallback(() => setIsOpen((p) => !p), [setIsOpen])

  const transform = isChevronCentered ? `translateY(${isOpen ? '50%' : '-50%'})` : null

  if (!isVisible) {
    return null
  }

  return (
    <div className={classNames('accordion', className)}>
      <div className="accordion__title" onClick={toggle}>
        {renderHeader?.() ?? (
          <Text type="medium" variant="md" {...titleProps}>
            {title}
          </Text>
        )}
        <Rotate
          when={isOpen}
          transform={transform}
          className={classNames('accordion__chevron', { centered: isChevronCentered })}
        >
          <SvgIcon Icon={ICONS.chevronDown} />
        </Rotate>
      </div>
      <Collapse in={isOpen} className="accordion__content">
        {renderContent?.() ?? (
          <Text type="medium">{replaceLineBreaksWithHtml(text)}</Text>
        )}
      </Collapse>
    </div>
  )
}

export default Accordion
