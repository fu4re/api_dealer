import React, {
  Element,
  ReactEventHandler,
  useState,
  useCallback,
  useImperativeHandle,
  useMemo,
  useEffect,
  forwardRef,
  Ref,
} from 'react'
import padStart from 'lodash/padStart'
import has from 'lodash/has'
import size from 'lodash/size'
import classNames from 'classnames'
import moment from 'moment'
import 'moment-precise-range-plugin'
import Popover from '@material-ui/core/Popover/Popover'
import SvgIcon from 'components/base/icon/SvgIcon'
import Button from 'components/base/button/Button'
import Text from 'components/base/text/Text'
import Row from 'components/base/row/Row'
import { Calendar, utils } from 'components/inputs/date/calendar'
import { ICONS } from 'assets/icons/icons'
import { stopPropagationEvent } from 'utils/common'
import { compareDates } from 'utils/date-time'
import { getNounByKey, getDatesLabel } from 'utils/common'
import { DATE_INPUT, DATE_FORMATS } from 'constants/date-time'
import './datepicker-base.scss'
import './datepicker.scss'

const { isBeforeDate, getToday, toNativeDate } = utils()

export type DateShape = { year: number, month: number, day: number }
export type DateRange = { from: DateShape, to: DateShape }
export type DateValue = DateShape | DateRange

export type DatePickerProps = {
  visible: boolean,
  value: DateValue,
  onChange: (value: DateValue) => void,
  anchorEl: Element | ((element: Element) => Element),
  onClose: ReactEventHandler<Record<string, any>>,
  toLeft?: boolean,
  minDate?: DateShape,
  maxDate?: DateShape,
  isRange?: boolean,
  isArray?: boolean,
  minRange?: number,
  hasDisabledDays?: boolean,
  inputValue?: string,
}

export const DATE_PICKER_DATE_FORMAT = DATE_FORMATS.date

const DATE_PICKER_MIN_DATE: DateShape = {
  day: 1,
  month: 1,
  year: new Date().getFullYear(),
}

const DATE_PICKER_MAX_DATE: DateShape = {
  day: 1,
  month: 1,
  year: new Date().getFullYear() + 15,
}

const slideDuration = '0.1s'

const isRangePicker = (value: DateValue) => has(value, 'from')

export const getShape = (m) => ({ day: m.date(), month: m.month() + 1, year: m.year() })

export const getTodayShape = () => getShape(moment())

export const formatDateForPicker = (
  value: string | Record<string, any> | Array<string>,
) => {
  const format = (v: string) => {
    if (!v) return null

    const m = moment(v, DATE_PICKER_DATE_FORMAT)
    return m.isValid() ? getShape(m) : null
  }

  return isRangePicker(value)
    ? { from: format(value.from), to: format(value.to) }
    : Array.isArray(value)
    ? value.map((date) => format(date))
    : format(value)
}

export const formatDateFromPicker = (value: DateValue) => {
  const pad = (value: number) => padStart(value, 2, '0')
  const format = (v: DateShape) => (v ? [pad(v.day), pad(v.month), v.year].join('.') : '')

  const rangeDelimeter = DATE_INPUT.RANGE_DELIMITER

  return isRangePicker(value)
    ? [format(value.from), value.to ? format(value.to) : ''].join(rangeDelimeter)
    : Array.isArray(value)
    ? value.map((date) => format(date)).join(DATE_INPUT.MULTI_DELIMITER)
    : format(value)
}

const DatePicker = (props: DatePickerProps, ref: Ref) => {
  const {
    visible = false,
    onClose,
    anchorEl,
    toLeft = false,
    minRange,
    isArray,
    hasDisabledDays,
    inputValue = '',
    ...other
  } = props

  const [currentDate, setCurrentDate] = useState(props.value ?? null)
  const [dates, setDates] = useState([])

  const minDate = useMemo(() => props.minDate || DATE_PICKER_MIN_DATE, [props.minDate])
  const maxDate = useMemo(() => props.maxDate || DATE_PICKER_MAX_DATE, [props.maxDate])

  const isRange = useMemo(
    () => props.isRange || isRangePicker(props.value),
    [props.isRange, props.value],
  )

  const isMulti = useMemo(() => Array.isArray(props.value), [props.value])

  useEffect(() => setDates([]), [isArray])

  const checkInvalidDate = useCallback(
    (value: string) => {
      return isBeforeDate(value, minDate) || isBeforeDate(DATE_PICKER_MAX_DATE, value)
    },
    [minDate],
  )

  const getRangePart = useCallback(
    (value: DateRange, key: string) => {
      return !value || checkInvalidDate(value[key]) ? '' : value[key]
    },
    [checkInvalidDate],
  )

  const getValueForCalendar = useCallback(() => {
    if (isRange) {
      return {
        from: getRangePart(currentDate, 'from'),
        to: getRangePart(currentDate, 'to'),
      }
    }

    if (isMulti) {
      return dates
    }

    return checkInvalidDate(currentDate) ? getToday() : currentDate
  }, [isRange, getRangePart, currentDate, checkInvalidDate, dates, isMulti])

  const onChange = useCallback(
    (value: DateValue) => {
      const isArray = Array.isArray(value)
      setCurrentDate(isArray ? value[size(value) - 1] : value)
      isArray && setDates(value)
    },
    [setCurrentDate, setDates],
  )

  useImperativeHandle(ref, () => ({ onChange }), [onChange])

  const horizontal = toLeft ? 'right' : 'left'
  const value = getValueForCalendar()

  const hasAllDates = isRangePicker(value) && Boolean(value.from) && Boolean(value.to)
  const withTip = isRangePicker(value) && value.from && !value.to

  const getDatePickerValue = useCallback(() => {
    const isAfterMaxDate = maxDate && compareDates(value, maxDate) === 'after'
    const isBeforeMinDate = minDate && compareDates(value, minDate) === 'before'
    const isInvalidDate = isAfterMaxDate || isBeforeMinDate

    return isInvalidDate ? null : value
  }, [value, maxDate, minDate])

  const getDisabledDays = useCallback(() => {
    if (!hasDisabledDays) {
      return []
    }

    const days = []
    const today = new Date()

    const startDay = toNativeDate(DATE_PICKER_MIN_DATE)
    const endDay = today.setDate(today.getDate() - 1)

    for (let day = startDay; day < endDay; day.setDate(day.getDate() + 1)) {
      days.push(formatDateForPicker(day))
    }

    return days
  }, [hasDisabledDays])

  const hasMinRange = Boolean(minRange) && minRange > 0

  const onBackdropClick = useCallback(() => {
    if (inputValue !== formatDateFromPicker(currentDate)) {
      onChange?.(formatDateForPicker(inputValue) || null)
    }

    onClose?.()
  }, [onChange, inputValue, currentDate, onClose])

  const onClear = useCallback(
    () => onChange?.(isRange ? { from: '', to: '' } : isMulti ? [] : ''),
    [onChange, isRange, isMulti],
  )

  const onApply = useCallback(() => {
    props.onChange?.(value)
    onClose?.()
  }, [value, props, onClose])

  const renderFooter = useCallback(
    () => (
      <Row className="Calendar__footer" horizontal="between">
        {(hasAllDates || hasMinRange) && (
          <Row>
            {hasAllDates ? (
              <>
                <SvgIcon Icon={ICONS.calendar} />
                <Text className="text-all-dates">{getDatesLabel(value)}</Text>
              </>
            ) : (
              hasMinRange && (
                <Text className="Calendar__footer-text">
                  {['Минимум', getNounByKey('days', minRange, true)].join(' ')}
                </Text>
              )
            )}
          </Row>
        )}
        <Row className="Calendar__buttons">
          <Button text="Очистить" size="small" variant="outline" onClick={onClear} />
          <Button text="Выбрать" size="small" onClick={onApply} />
        </Row>
      </Row>
    ),
    [hasAllDates, hasMinRange, minRange, value, onClear, onApply],
  )

  return (
    <Popover
      classes={{
        paper: ['date__paper', toLeft && 'date__paper--to-left']
          .filter(Boolean)
          .join(' '),
      }}
      open={visible}
      anchorEl={anchorEl.current}
      anchorOrigin={{ vertical: 'bottom', horizontal }}
      transformOrigin={{ vertical: 'top', horizontal }}
      onBackdropClick={onBackdropClick}
    >
      <div onClick={stopPropagationEvent} className="date__container">
        {withTip && (
          <div
            className={classNames('date__tip', {
              'date__tip--without-min': !hasMinRange,
            })}
          >
            <span>{'Выберите вторую дату'}</span>
          </div>
        )}
        <Calendar
          {...other}
          calendarClassName={classNames(
            'date',
            hasMinRange ? 'date--with-min' : 'date--without-min',
            { 'date--with-tip': withTip, 'date--all-dates': hasAllDates },
          )}
          disabledDays={getDisabledDays()}
          value={getDatePickerValue()}
          onChange={onChange}
          slideAnimationDuration={slideDuration}
          minRange={minRange}
          minimumDate={minDate}
          maximumDate={maxDate}
          selectorStartingYear={minDate.year}
          selectorEndingYear={maxDate.year}
          renderMonthChangeArrow={() => <SvgIcon Icon={ICONS.chevronDown} />}
          renderAtBottom={renderFooter}
          hasDisabledDays={hasDisabledDays}
        />
      </div>
    </Popover>
  )
}

export default forwardRef(DatePicker)
