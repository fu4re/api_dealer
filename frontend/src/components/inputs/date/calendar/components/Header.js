import React, { useEffect, useRef, ReactNode } from 'react'
import classNames from 'classnames'
import { isSameDay } from 'components/inputs/date/calendar/shared/generalUtils'
import {
  getSlideDate,
  animateContent,
  handleSlideAnimationEnd,
} from 'components/inputs/date/calendar/shared/sliderHelpers'
import {
  useLocaleUtils,
  useLocaleLanguage,
} from 'components/inputs/date/calendar/shared/hooks'
import type { DateShape } from 'components/inputs/date/DatePicker'
import type { LocaleType } from 'components/inputs/date/calendar/shared/constants'

export type HeaderProps = {
  maximumDate?: DateShape,
  minimumDate?: DateShape,
  onMonthChange?: () => void,
  activeDate?: DateShape,
  monthChangeDirection?: string,
  renderMonthChangeArrow?: () => ReactNode,
  onMonthSelect?: () => void,
  onYearSelect?: () => void,
  isMonthSelectorOpen?: boolean,
  isYearSelectorOpen?: boolean,
  locale?: LocaleType,
}

const Header = (props: HeaderProps) => {
  const {
    maximumDate,
    minimumDate,
    onMonthChange,
    activeDate,
    monthChangeDirection,
    renderMonthChangeArrow,
    onMonthSelect,
    onYearSelect,
    isMonthSelectorOpen = false,
    isYearSelectorOpen = false,
    locale,
  } = props

  const headerElement = useRef(null)
  const monthYearWrapperElement = useRef(null)

  const { getMonthName, isBeforeDate, getLanguageDigits } = useLocaleUtils(locale)
  const {
    isRtl,
    nextMonth,
    previousMonth,
    openMonthSelector,
    closeMonthSelector,
    openYearSelector,
    closeYearSelector,
  } = useLocaleLanguage(locale)

  useEffect(() => {
    if (!monthChangeDirection) return

    animateContent({
      direction: monthChangeDirection,
      parent: monthYearWrapperElement.current,
    })
  }, [monthChangeDirection])

  useEffect(() => {
    const isOpen = isMonthSelectorOpen || isYearSelectorOpen

    const monthSelector = '.Calendar__monthYear.-shown .Calendar__monthText'
    const monthText = headerElement.current.querySelector(monthSelector)

    const yearText = monthText.nextSibling
    const hasActiveBg = (element) => element.classList.contains('-activeBackground')

    const isInitialRender = !isOpen && !hasActiveBg(monthText) && !hasActiveBg(yearText)
    if (isInitialRender) {
      return
    }

    const arrows = [
      ...headerElement.current.querySelectorAll('.Calendar__monthArrowWrapper'),
    ]

    const hasMonthSelectorToggled = isMonthSelectorOpen || hasActiveBg(monthText)
    const primaryElement = hasMonthSelectorToggled ? monthText : yearText
    const secondaryElement = hasMonthSelectorToggled ? yearText : monthText

    let translateXDirection = hasMonthSelectorToggled ? 1 : -1
    if (isRtl) {
      translateXDirection *= -1
    }

    const translateX = isOpen
      ? `${(translateXDirection * secondaryElement.offsetWidth) / 2}`
      : 0

    isOpen
      ? secondaryElement.setAttribute('aria-hidden', true)
      : secondaryElement.removeAttribute('aria-hidden')

    secondaryElement.setAttribute('tabindex', isOpen ? '-1' : '0')
    secondaryElement.style.transform = ''

    primaryElement.style.transform = `${translateX ? `translateX(${translateX}px)` : ''}`
    primaryElement.classList.toggle('-activeBackground')

    secondaryElement.classList.toggle('-hidden')

    arrows.forEach((arrow) => {
      const isHidden = arrow.classList.contains('-hidden')
      arrow.classList.toggle('-hidden')

      if (isHidden) {
        arrow.removeAttribute('aria-hidden')
        arrow.setAttribute('tabindex', '0')
      } else {
        arrow.setAttribute('aria-hidden', true)
        arrow.setAttribute('tabindex', '-1')
      }
    })
  }, [isMonthSelectorOpen, isYearSelectorOpen, isRtl])

  const getMonthYearText = (isInitialActiveChild) => {
    const date = getSlideDate({
      isInitialActiveChild,
      monthChangeDirection,
      activeDate,
      parent: monthYearWrapperElement.current,
    })

    const year = getLanguageDigits(date.year)
    const month = getMonthName(date.month)

    return { month, year }
  }

  const nextDate = { ...activeDate, month: activeDate.month + 1, day: 1 }
  const isNextMonthArrowDisabled = maximumDate && isBeforeDate(maximumDate, nextDate)

  const prevDate = { ...activeDate, day: 1 }
  const isBeforeMin = isBeforeDate(prevDate, minimumDate)
  const isMin = isSameDay(minimumDate, prevDate)
  const isPreviousMonthArrowDisabled = minimumDate && (isBeforeMin || isMin)

  const onMonthChangeTrigger = (direction) => {
    const children = Array.from(monthYearWrapperElement.current.children)
    const hasClass = (child) => child.classList.contains('-shownAnimated')
    const isMonthChanging = children.some(hasClass)

    if (isMonthChanging) {
      return
    }

    onMonthChange(direction)
  }

  // first button text is the one who shows the current month and year (initial active child)
  const monthYearButtons = [true, false].map((isInitialActiveChild) => {
    const { month, year } = getMonthYearText(isInitialActiveChild)

    const isActiveMonth = month === getMonthName(activeDate.month)
    const hiddenStatus = {
      ...(isActiveMonth ? {} : { 'aria-hidden': true }),
    }

    return (
      <div
        key={String(isInitialActiveChild)}
        onAnimationEnd={handleSlideAnimationEnd}
        role="presentation"
        className={classNames(
          'Calendar__monthYear',
          isInitialActiveChild ? '-shown' : '-hiddenNext',
        )}
        {...hiddenStatus}
      >
        <button
          onClick={onMonthSelect}
          type="button"
          className="Calendar__monthText"
          aria-label={isMonthSelectorOpen ? closeMonthSelector : openMonthSelector}
          tabIndex={isActiveMonth ? '0' : '-1'}
          {...hiddenStatus}
        >
          {month}
        </button>
        <button
          onClick={onYearSelect}
          type="button"
          className="Calendar__yearText"
          aria-label={isYearSelectorOpen ? closeYearSelector : openYearSelector}
          tabIndex={isActiveMonth ? '0' : '-1'}
          {...hiddenStatus}
        >
          {year}
        </button>
      </div>
    )
  })

  return (
    <div ref={headerElement} className="Calendar__header">
      <button
        className="Calendar__monthArrowWrapper -right"
        onClick={() => onMonthChangeTrigger('PREVIOUS')}
        aria-label={previousMonth}
        type="button"
        disabled={isPreviousMonthArrowDisabled}
      >
        {renderMonthChangeArrow ? (
          renderMonthChangeArrow()
        ) : (
          <span className="Calendar__monthArrow" />
        )}
      </button>
      <div
        className="Calendar__monthYearContainer"
        ref={monthYearWrapperElement}
        data-testid="month-year-container"
      >
        &nbsp;
        {monthYearButtons}
      </div>
      <button
        className="Calendar__monthArrowWrapper -left"
        onClick={() => onMonthChangeTrigger('NEXT')}
        aria-label={nextMonth}
        type="button"
        disabled={isNextMonthArrowDisabled}
      >
        {renderMonthChangeArrow ? (
          renderMonthChangeArrow()
        ) : (
          <span className="Calendar__monthArrow" />
        )}
      </button>
    </div>
  )
}

export default Header
