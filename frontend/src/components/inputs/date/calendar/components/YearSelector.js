import React, { useRef, useEffect } from 'react'
import classNames from 'classnames'
import {
  MINIMUM_SELECTABLE_YEAR_SUBTRACT,
  MAXIMUM_SELECTABLE_YEAR_SUM,
} from 'components/inputs/date/calendar/shared/constants'
import Confirm from 'components/base/confirm/Confirm'
import handleKeyboardNavigation from 'components/inputs/date/calendar/shared/keyboardNavigation'
import { useLocaleUtils } from 'components/inputs/date/calendar/shared/hooks'
import type { DateShape } from 'components/inputs/date/DatePicker'
import type { LocaleType } from 'components/inputs/date/calendar/shared/constants'

export type YearProps = {
  isOpen?: boolean,
  activeDate?: DateShape,
  onYearSelect?: () => void,
  selectorStartingYear?: number,
  selectorEndingYear?: number,
  maximumDate?: DateShape,
  minimumDate?: DateShape,
  locale?: LocaleType,
}

const YearSelector = (props: YearProps) => {
  const {
    isOpen = false,
    activeDate,
    onYearSelect,
    selectorStartingYear = 0,
    selectorEndingYear = 0,
    maximumDate,
    minimumDate,
    locale,
  } = props

  const wrapperElement = useRef(null)
  const yearListElement = useRef(null)

  const { getLanguageDigits, getToday } = useLocaleUtils(locale)

  const currentYear = getToday().year

  const min = MINIMUM_SELECTABLE_YEAR_SUBTRACT
  const max = MAXIMUM_SELECTABLE_YEAR_SUM

  const startingYearValue = selectorStartingYear || currentYear - min
  const endingYearValue = selectorEndingYear || currentYear + max

  const allYears = []
  for (let i = startingYearValue; i <= endingYearValue; i += 1) {
    allYears.push(i)
  }

  useEffect(() => {
    const classToggleMethod = isOpen ? 'add' : 'remove'
    const yearSelector = '.Calendar__yearSelectorItem.-active'
    const activeSelectorYear = wrapperElement.current.querySelector(yearSelector)

    if (!activeSelectorYear) {
      Confirm.showError({ message: 'Ошибка при выборе года' })
      console.error(
        `Provided value for year is out of selectable year range.
        You're probably using a wrong locale prop value or your provided
        value's locale is different from the date picker locale.
        Try changing the 'locale' prop or the value you've provided.`,
      )
      return
    }

    wrapperElement.current.classList[classToggleMethod]('-faded')

    const offsetTop = activeSelectorYear.offsetTop
    const offsetHeight = activeSelectorYear.offsetHeight
    yearListElement.current.scrollTop = offsetTop - offsetHeight * 5

    yearListElement.current.classList[classToggleMethod]('-open')
  }, [isOpen])

  const renderSelectorYears = () => {
    return allYears.map((item) => {
      const isAfterMaximumDate = maximumDate && item > maximumDate.year
      const isBeforeMinimumDate = minimumDate && item < minimumDate.year

      const isSelected = activeDate.year === item

      return (
        <li
          key={item}
          className={classNames('Calendar__yearSelectorItem', { '-active': isSelected })}
        >
          <button
            tabIndex={isSelected && isOpen ? '0' : '-1'}
            className="Calendar__yearSelectorText"
            type="button"
            onClick={() => onYearSelect(item)}
            disabled={isAfterMaximumDate || isBeforeMinimumDate}
            aria-pressed={isSelected}
            data-is-default-selectable={isSelected}
          >
            {getLanguageDigits(item)}
          </button>
        </li>
      )
    })
  }

  const handleKeyDown = (e) => {
    handleKeyboardNavigation(e, { allowVerticalArrows: false })
  }

  return (
    <div
      className="Calendar__yearSelectorAnimationWrapper"
      role="presentation"
      {...(isOpen ? {} : { 'aria-hidden': true })}
    >
      <div
        ref={wrapperElement}
        className="Calendar__yearSelectorWrapper"
        role="presentation"
        data-testid="year-selector-wrapper"
        onKeyDown={handleKeyDown}
      >
        <ul
          ref={yearListElement}
          className="Calendar__yearSelector"
          data-testid="year-selector"
        >
          {renderSelectorYears()}
        </ul>
      </div>
    </div>
  )
}

export default YearSelector
