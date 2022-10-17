import React, { useState, useRef, useEffect, ReactNode } from 'react'
import classNames from 'classnames'
import size from 'lodash/size'
import Text from 'components/base/text/Text'
import {
  getDateAccordingToMonth,
  shallowClone,
  getValueType,
} from 'components/inputs/date/calendar/shared/generalUtils'
import {
  TYPE_SINGLE_DATE,
  TYPE_RANGE,
  TYPE_MUTLI_DATE,
} from 'components/inputs/date/calendar/shared/constants'
import {
  useLocaleUtils,
  useLocaleLanguage,
} from 'components/inputs/date/calendar/shared/hooks'
import {
  Header,
  MonthSelector,
  YearSelector,
  DaysList,
} from 'components/inputs/date/calendar/components'
import type { LocaleType } from 'components/inputs/date/calendar/shared/constants'
import type { DateValue, DateShape } from 'components/inputs/date/DatePicker'

export type CalendarProps = {
  value?: DateValue,
  onChange?: () => void,
  onDisabledDayError?: () => void,
  calendarClassName?: string,
  calendarTodayClassName?: string,
  calendarSelectedDayClassName?: string,
  calendarRangeStartClassName?: string,
  calendarRangeBetweenClassName?: string,
  calendarRangeEndClassName?: string,
  disabledDays?: Array<DateShape>,
  slideAnimationDuration?: string,
  minimumDate?: DateShape,
  maximumDate?: DateShape,
  selectorStartingYear?: number,
  selectorEndingYear?: number,
  locale?: LocaleType,
  shouldHighlightWeekends?: boolean,
  renderMonthChangeArrow?: () => ReactNode,
  renderAtTop?: () => ReactNode,
  renderAtBottom?: () => ReactNode,
  minRange?: number,
}

const Calendar = (props: CalendarProps) => {
  const {
    value = null,
    onChange,
    onDisabledDayError,
    calendarClassName = '',
    calendarTodayClassName = '',
    calendarSelectedDayClassName = '',
    calendarRangeStartClassName = '',
    calendarRangeBetweenClassName = '',
    calendarRangeEndClassName = '',
    disabledDays,
    slideAnimationDuration = '0.1s',
    minimumDate = null,
    maximumDate = null,
    selectorStartingYear,
    selectorEndingYear,
    locale = 'ru',
    shouldHighlightWeekends = false,
    renderMonthChangeArrow,
    renderAtTop,
    renderAtBottom,
    minRange,
  } = props

  const calendarElement = useRef(null)

  const [mainState, setMainState] = useState({
    activeDate: null,
    monthChangeDirection: '',
    isMonthSelectorOpen: false,
    isYearSelectorOpen: false,
  })

  useEffect(() => {
    // https://reactjs.org/blog/2020/08/10/react-v17-rc.html#potential-issues
    const element = calendarElement.current
    if (element) {
      const handleKeyUp = ({ key }) => {
        /* istanbul ignore else */
        if (key === 'Tab') element.classList.remove('-noFocusOutline')
      }

      element.addEventListener('keyup', handleKeyUp, false)

      return () => element.removeEventListener('keyup', handleKeyUp, false)
    }
  }, [])

  const { getToday } = useLocaleUtils(locale)
  const { weekDays: weekDaysList, weekDaysShort, isRtl } = useLocaleLanguage(locale)

  const today = getToday()

  const createStateToggler = (property) => () => {
    setMainState({ ...mainState, [property]: !mainState[property] })
  }

  const toggleMonthSelector = createStateToggler('isMonthSelectorOpen')
  const toggleYearSelector = createStateToggler('isYearSelectorOpen')

  const getComputedActiveDate = () => {
    const valueType = getValueType(value)

    if (valueType === TYPE_MUTLI_DATE && size(value) > 0) {
      return shallowClone(value[0])
    }

    if (valueType === TYPE_SINGLE_DATE && value) {
      return shallowClone(value)
    }

    if (valueType === TYPE_RANGE && value.from) {
      return shallowClone(value.from)
    }

    return shallowClone(today)
  }

  const activeDate = mainState.activeDate
    ? shallowClone(mainState.activeDate)
    : getComputedActiveDate()

  const weekdays = weekDaysList.map((weekDay, index) => (
    <Text key={weekDay} Component="abbr" title={weekDay} className="Calendar__weekDay">
      {weekDaysShort ? weekDaysShort[index] : weekDay[0]}
    </Text>
  ))

  const handleMonthChange = (direction) => {
    setMainState({ ...mainState, monthChangeDirection: direction })
  }

  const updateDate = () => {
    setMainState({
      ...mainState,
      activeDate: getDateAccordingToMonth(activeDate, mainState.monthChangeDirection),
      monthChangeDirection: '',
    })
  }

  const selectMonth = (newMonthNumber) => {
    setMainState({
      ...mainState,
      activeDate: { ...activeDate, month: newMonthNumber },
      isMonthSelectorOpen: false,
    })
  }

  const selectYear = (year) => {
    setMainState({
      ...mainState,
      activeDate: { ...activeDate, year },
      isYearSelectorOpen: false,
    })
  }

  return (
    <div
      className={classNames(
        'Calendar',
        '-noFocusOutline',
        calendarClassName,
        isRtl ? '-rtl' : '-ltr',
      )}
      ref={calendarElement}
      role="grid"
      style={{ '--animation-duration': slideAnimationDuration }}
    >
      {renderAtTop?.()}
      <Header
        maximumDate={maximumDate}
        minimumDate={minimumDate}
        activeDate={activeDate}
        onMonthChange={handleMonthChange}
        onMonthSelect={toggleMonthSelector}
        onYearSelect={toggleYearSelector}
        monthChangeDirection={mainState.monthChangeDirection}
        renderMonthChangeArrow={renderMonthChangeArrow}
        isMonthSelectorOpen={mainState.isMonthSelectorOpen}
        isYearSelectorOpen={mainState.isYearSelectorOpen}
        locale={locale}
      />
      <MonthSelector
        isOpen={mainState.isMonthSelectorOpen}
        activeDate={activeDate}
        onMonthSelect={selectMonth}
        maximumDate={maximumDate}
        minimumDate={minimumDate}
        locale={locale}
      />
      <YearSelector
        isOpen={mainState.isYearSelectorOpen}
        activeDate={activeDate}
        onYearSelect={selectYear}
        selectorStartingYear={selectorStartingYear}
        selectorEndingYear={selectorEndingYear}
        maximumDate={maximumDate}
        minimumDate={minimumDate}
        locale={locale}
      />
      <div className="Calendar__weekDays">{weekdays}</div>
      <DaysList
        activeDate={activeDate}
        value={value}
        monthChangeDirection={mainState.monthChangeDirection}
        onSlideChange={updateDate}
        disabledDays={disabledDays}
        onDisabledDayError={onDisabledDayError}
        minRange={minRange}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onChange={onChange}
        calendarTodayClassName={calendarTodayClassName}
        calendarSelectedDayClassName={calendarSelectedDayClassName}
        calendarRangeStartClassName={calendarRangeStartClassName}
        calendarRangeEndClassName={calendarRangeEndClassName}
        calendarRangeBetweenClassName={calendarRangeBetweenClassName}
        locale={locale}
        shouldHighlightWeekends={shouldHighlightWeekends}
        isQuickSelectorOpen={
          mainState.isYearSelectorOpen || mainState.isMonthSelectorOpen
        }
      />
      {renderAtBottom?.()}
    </div>
  )
}

export { Calendar }
