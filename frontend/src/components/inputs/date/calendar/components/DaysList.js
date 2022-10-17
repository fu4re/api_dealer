import React, { useRef, useEffect, useState } from 'react'
import classNames from 'classnames'
import cloneDeep from 'lodash/cloneDeep'
import flattenDeep from 'lodash/flattenDeep'
import moment from 'moment'
import {
  getSlideDate,
  handleSlideAnimationEnd,
  animateContent,
} from 'components/inputs/date/calendar/shared/sliderHelpers'
import {
  isSameDay,
  createUniqueRange,
  getValueType,
} from 'components/inputs/date/calendar/shared/generalUtils'
import {
  TYPE_SINGLE_DATE,
  TYPE_RANGE,
  TYPE_MUTLI_DATE,
} from 'components/inputs/date/calendar/shared/constants'
import handleKeyboardNavigation from 'components/inputs/date/calendar/shared/keyboardNavigation'
import {
  useLocaleUtils,
  useLocaleLanguage,
} from 'components/inputs/date/calendar/shared/hooks'
import type { DateValue, DateRange, DateShape } from 'components/inputs/date/DatePicker'
import type { LocaleType } from 'components/inputs/date/calendar/shared/constants'
import { getDateFromDay } from 'utils/date-time'
import { DATE_INPUT } from 'constants/date-time'

export type DaysListProps = {
  activeDate?: DateValue,
  value?: DateValue,
  monthChangeDirection?: string,
  onSlideChange?: () => void,
  disabledDays?: Array<DateShape>,
  onDisabledDayError?: () => void,
  minimumDate?: DateShape,
  maximumDate?: DateShape,
  onChange?: () => void,
  locale?: LocaleType,
  calendarTodayClassName?: string,
  calendarSelectedDayClassName?: string,
  calendarRangeStartClassName?: string,
  calendarRangeEndClassName?: string,
  calendarRangeBetweenClassName?: string,
  shouldHighlightWeekends?: boolean,
  isQuickSelectorOpen?: boolean,
}

const DaysList = (props: DaysListProps) => {
  const {
    activeDate,
    value,
    monthChangeDirection,
    onSlideChange,
    disabledDays,
    onDisabledDayError,
    minimumDate,
    maximumDate,
    onChange,
    locale,
    calendarTodayClassName = '',
    calendarSelectedDayClassName = '',
    calendarRangeStartClassName = '',
    calendarRangeEndClassName = '',
    calendarRangeBetweenClassName = '',
    shouldHighlightWeekends = false,
    isQuickSelectorOpen,
    minRange,
  } = props

  const calendarSectionWrapper = useRef(null)

  const [hovered, setHovered] = useState(null)

  const { isRtl, weekDays: weekDaysList } = useLocaleLanguage(locale)

  const {
    getToday,
    isBeforeDate,
    checkDayInDayRange,
    getMonthFirstWeekday,
    getMonthLength,
    getLanguageDigits,
    getMonthName,
  } = useLocaleUtils(locale)

  const today = getToday()

  useEffect(() => {
    if (!monthChangeDirection) return

    animateContent({
      direction: monthChangeDirection,
      parent: calendarSectionWrapper.current,
    })
  }, [monthChangeDirection])

  const hasMinRange = Boolean(minRange) && minRange > 0

  const hasDisabledDay = (disabledDay: DateShape, { from, to }: DateRange) => {
    return checkDayInDayRange({ day: disabledDay, from, to })
  }

  const getDayRangeValue = (day: DateShape) => {
    const newDay = cloneDeep(value)

    const hasDays = newDay.from && newDay.to
    const dayRange = hasDays ? { from: null, to: null } : newDay

    const key = dayRange.from ? 'to' : 'from'
    dayRange[key] = day

    const { from, to } = dayRange

    // Меняем местами значения from и to, если from позже to
    if (isBeforeDate(dayRange.to, dayRange.from)) {
      dayRange.from = to
      dayRange.to = from
    }

    const disabledDay = disabledDays.find((day) => hasDisabledDay(day, dayRange))

    if (disabledDay) {
      onDisabledDayError(disabledDay)
      return value
    }

    return dayRange
  }

  const getMultiDateValue = (day: DateShape) => {
    const newValue = flattenDeep(value)
    const isExist = newValue.some((valueDay) => isSameDay(valueDay, day))

    return [
      ...new Set(
        isExist
          ? newValue.filter((valueDay) => !isSameDay(valueDay, day))
          : [...newValue, day],
      ),
    ]
  }

  const getNewValue = (day: DateShape) => {
    const valueType = getValueType(value)

    const actionsByType = {
      [TYPE_SINGLE_DATE]: () => day,
      [TYPE_RANGE]: () => getDayRangeValue(day),
      [TYPE_MUTLI_DATE]: () => getMultiDateValue(day),
    }

    const action = actionsByType[valueType]
    return action()
  }

  const handleDayClick = (day: DateShape) => onChange(getNewValue(day))

  const isSingleDateSelected = (day: DateShape) => {
    const valueType = getValueType(value)

    if (valueType === TYPE_SINGLE_DATE) {
      return isSameDay(day, value)
    }

    if (valueType === TYPE_MUTLI_DATE) {
      return value.some((valueDay) => isSameDay(valueDay, day))
    }
  }

  const getDayStatus = (day: DateShape) => {
    const { from, to } = value || {}

    const check = ({ from, to }) => checkDayInDayRange({ day, from, to })

    const isToday = isSameDay(day, today)
    const isSelected = isSingleDateSelected(day)
    const isStartingDayRange = isSameDay(day, from)
    const isEndingDayRange = isSameDay(day, to)
    const isWithinRange = check({ from, to })

    const checkInRange = (a, b) => check(a) || check(b)

    const isInRangeWithoutTo =
      !to && checkInRange({ from, to: hovered }, { from: hovered, to: from })
    const isInRangeWithoutFrom =
      !from && checkInRange({ from: hovered, to }, { from: to, to: hovered })
    const isWithinRangeHover = isInRangeWithoutTo || isInRangeWithoutFrom

    const isHoveredStart = !from && isBeforeDate(hovered, from) && isSameDay(day, hovered)
    const isHoveredEnd = !to && isBeforeDate(from, hovered) && isSameDay(day, hovered)

    return {
      isToday,
      isSelected,
      isStartingDayRange,
      isEndingDayRange,
      isWithinRange,
      isWithinRangeHover,
      isHoveredStart,
      isHoveredEnd,
    }
  }

  const getDayClassNames = (day: DateShape) => {
    const {
      isToday,
      isSelected,
      isStartingDayRange,
      isEndingDayRange,
      isWithinRange,
      isWithinRangeHover,
      isHoveredStart,
      isHoveredEnd,
    } = getDayStatus(day)

    const { isStandard, isWeekend, isDisabled } = day

    return classNames({
      '-today': isToday && !isSelected,
      [calendarTodayClassName]: isToday && !isSelected,
      '-blank': !isStandard,
      '-weekend': isWeekend && shouldHighlightWeekends,
      '-selected': isSelected,
      [calendarSelectedDayClassName]: isSelected,
      '-selectedStart': isStartingDayRange,
      [calendarRangeStartClassName]: isStartingDayRange,
      '-selectedEnd': isEndingDayRange,
      [calendarRangeEndClassName]: isEndingDayRange,
      '-selectedBetween': isWithinRange,
      [calendarRangeBetweenClassName]: isWithinRange,
      '-hoveredBetween': isWithinRangeHover,
      '-hoveredStart': isHoveredStart,
      '-hoveredEnd': isHoveredEnd,
      '-disabled': isDisabled,
    })
  }

  const getViewMonthDays = (date: DateShape) => {
    const newDate = date[0] ?? date
    const { month, year } = newDate

    // to match month starting date with the correct weekday label
    const firstDay = getMonthFirstWeekday(newDate)
    const prependingBlankDays = createUniqueRange(firstDay, 'starting-blank')

    const uniqueRange = createUniqueRange(getMonthLength(newDate))
    const standardDays = uniqueRange.map((day) => ({
      ...day,
      isStandard: true,
      month,
      year,
    }))

    return [...prependingBlankDays, ...standardDays]
  }

  const handleDayPress = ({ isDisabled, ...dayItem }) => {
    isDisabled ? onDisabledDayError(dayItem) : handleDayClick(dayItem)
  }

  const isDayReachableByKeyboard = ({
    isOnActiveSlide,
    isStandard,
    isSelected,
    isStartingDayRange,
    isToday,
    day,
  }) => {
    if (isQuickSelectorOpen || !isOnActiveSlide || !isStandard) return false
    if (isSelected || isStartingDayRange || isToday || day === 1) return true
  }

  const renderEachWeekDays = ({ value: day, month, year, isStandard }, index) => {
    const dayItem = { day, month, year }

    const isSame = (disabledDay) => isSameDay(dayItem, disabledDay)
    const isInDisabledDaysRange = disabledDays.some(isSame)

    const isBeforeMinimumDate = isBeforeDate(dayItem, minimumDate)
    const isAfterMaximumDate = isBeforeDate(maximumDate, dayItem)
    const isNotInValidRange = isStandard && (isBeforeMinimumDate || isAfterMaximumDate)

    const isDisabled = isInDisabledDaysRange || isNotInValidRange
    const isWeekend = (!isRtl && index % 7 === 0) || index % 7 === 6

    const additionalClass = getDayClassNames({
      ...dayItem,
      isWeekend,
      isStandard,
      isDisabled,
    })

    const label = [day, getMonthName(month), year].join(' ')
    const dayLabel = [weekDaysList[index], label].join(DATE_INPUT.MULTI_DELIMITER)
    const isOnActiveSlide = month === activeDate.month

    const dayStatus = getDayStatus(dayItem)
    const { isSelected, isStartingDayRange, isEndingDayRange, isWithinRange } = dayStatus

    const shouldEnableKeyboardNavigation = isDayReachableByKeyboard({
      ...dayItem,
      ...dayStatus,
      isOnActiveSlide,
      isStandard,
    })

    const selected = isSelected || isStartingDayRange || isEndingDayRange || isWithinRange

    const currentDay = getDateFromDay(dayItem)
    const fromDay = getDateFromDay(value?.from)
    const duration = moment.duration(currentDay.diff(fromDay)).asDays()

    const hasOnlyFrom = Boolean(value?.from) && !Boolean(value?.to)
    const isLessThanMin = Math.abs(duration) < minRange
    const isForbidden = hasMinRange && hasOnlyFrom && isLessThanMin

    return (
      <div
        key={dayLabel}
        tabIndex={shouldEnableKeyboardNavigation ? '0' : '-1'}
        className={classNames('Calendar__day', isRtl ? '-rtl' : '-ltr', additionalClass)}
        role="gridcell"
        data-is-default-selectable={shouldEnableKeyboardNavigation}
        aria-disabled={isDisabled}
        aria-label={dayLabel}
        aria-selected={selected}
        {...(!isStandard || !isOnActiveSlide || isQuickSelectorOpen
          ? { 'aria-hidden': true }
          : {})}
        onClick={isForbidden ? void 0 : () => handleDayPress({ ...dayItem, isDisabled })}
        onMouseEnter={() => setHovered(dayItem)}
        onMouseLeave={() => setHovered(null)}
        onKeyDown={
          isForbidden
            ? void 0
            : ({ key }) => key === 'Enter' && handleDayPress({ ...dayItem, isDisabled })
        }
      >
        <div className="Calendar__day__inner" style={isForbidden ? { color: 'red' } : {}}>
          {isStandard ? getLanguageDigits(day) : ''}
        </div>
      </div>
    )
  }

  const renderMonthDays = (isInitialActiveChild: boolean) => {
    const date = getSlideDate({
      activeDate: activeDate[0] ?? activeDate,
      isInitialActiveChild,
      monthChangeDirection,
      parent: calendarSectionWrapper.current,
    })

    const allDays = getViewMonthDays(date)

    const renderSingleWeekRow = (weekRowIndex) => {
      const eachWeekDays = allDays
        .slice(weekRowIndex * 7, (weekRowIndex + 1) * 7)
        .map(renderEachWeekDays)

      return (
        <div key={String(weekRowIndex)} className="Calendar__weekRow" role="row">
          {eachWeekDays}
        </div>
      )
    }

    return Array.from(Array(6).keys()).map(renderSingleWeekRow)
  }

  const handleKeyDown = (e) => handleKeyboardNavigation(e, { allowVerticalArrows: true })

  const renderDaysBlock = (key: string = '-shown') => (
    <div
      className={classNames('Calendar__section', key)}
      role="rowgroup"
      onAnimationEnd={(e) => {
        handleSlideAnimationEnd(e)
        onSlideChange()
      }}
    >
      {renderMonthDays(key === '-shown')}
    </div>
  )

  return (
    <div
      ref={calendarSectionWrapper}
      className="Calendar__sectionWrapper"
      role="presentation"
      data-testid="days-section-wrapper"
      onKeyDown={handleKeyDown}
    >
      {renderDaysBlock()}
      {renderDaysBlock('-hiddenNext')}
    </div>
  )
}

export default DaysList
