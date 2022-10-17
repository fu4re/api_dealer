import React, { useRef, useEffect } from 'react'
import classNames from 'classnames'
import { isSameDay } from 'components/inputs/date/calendar/shared/generalUtils'
import handleKeyboardNavigation from 'components/inputs/date/calendar/shared/keyboardNavigation'
import {
  useLocaleUtils,
  useLocaleLanguage,
} from 'components/inputs/date/calendar/shared/hooks'
import type { DateShape } from 'components/inputs/date/DatePicker'
import type { LocaleType } from 'components/inputs/date/calendar/shared/constants'

export type MonthProps = {
  activeDate?: DateShape,
  maximumDate?: DateShape,
  minimumDate?: DateShape,
  onMonthSelect?: () => void,
  isOpen?: boolean,
  locale?: LocaleType,
}

const MonthSelector = (props: MonthProps) => {
  const {
    activeDate,
    maximumDate,
    minimumDate,
    onMonthSelect,
    isOpen = false,
    locale,
  } = props

  const monthSelector = useRef(null)

  useEffect(() => {
    const classToggleMethod = isOpen ? 'add' : 'remove'
    monthSelector.current.classList[classToggleMethod]('-open')
  }, [isOpen])

  const { getMonthNumber, isBeforeDate } = useLocaleUtils(locale)
  const { months: monthsList } = useLocaleLanguage(locale)

  const handleKeyDown = (e) => {
    handleKeyboardNavigation(e, { allowVerticalArrows: false })
  }

  const renderMonthSelectorItems = () =>
    monthsList.map((persianMonth) => {
      const monthNumber = getMonthNumber(persianMonth)
      const monthDate = { day: 1, month: monthNumber, year: activeDate.year }

      const month = { ...monthDate, month: monthNumber }
      const isAfterMaximumDate = maximumDate && isBeforeDate(maximumDate, month)

      const nextMonth = { ...monthDate, month: monthNumber + 1 }
      const isBeforeMin = isBeforeDate(nextMonth, minimumDate)
      const isMin = isSameDay(nextMonth, minimumDate)
      const isBeforeMinimumDate = minimumDate && (isBeforeMin || isMin)

      const isSelected = monthNumber === activeDate.month

      return (
        <li
          key={persianMonth}
          className={classNames('Calendar__monthSelectorItem', { '-active': isSelected })}
        >
          <button
            tabIndex={isSelected && isOpen ? '0' : '-1'}
            onClick={() => onMonthSelect(monthNumber)}
            className="Calendar__monthSelectorItemText"
            type="button"
            disabled={isAfterMaximumDate || isBeforeMinimumDate}
            aria-pressed={isSelected}
            data-is-default-selectable={isSelected}
          >
            {persianMonth}
          </button>
        </li>
      )
    })

  return (
    <div
      role="presentation"
      className="Calendar__monthSelectorAnimationWrapper"
      {...(isOpen ? {} : { 'aria-hidden': true })}
    >
      <div
        role="presentation"
        data-testid="month-selector-wrapper"
        className="Calendar__monthSelectorWrapper"
        onKeyDown={handleKeyDown}
      >
        <ul
          ref={monthSelector}
          className="Calendar__monthSelector"
          data-testid="month-selector"
        >
          {renderMonthSelectorItems()}
        </ul>
      </div>
    </div>
  )
}

export default MonthSelector
