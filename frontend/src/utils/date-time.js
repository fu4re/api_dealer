import moment from 'moment'
import localization from 'moment/locale/ru'
import isString from 'lodash/isString'
import { DATE_FORMATS } from 'constants/date-time'
import { formatDateFromPicker } from 'components/inputs/date/DatePicker'
import type { DateShape } from 'components/inputs/date/DatePicker'

moment.locale('ru', localization)

export const DateFormat = (date: string, format: string = DATE_FORMATS.date) => {
  if (!date) {
    return ''
  }

  if (!isString(date)) {
    console.warn(`DateFormat - date is not a string`, date)
    return '?'
  }

  const m = moment(date, DATE_FORMATS.dateTime)
  if (!m.isValid()) {
    console.warn(`DateFormat - invalid date for converting`, date, m)
    return date
  }

  return m.format(format)
}

export const compareDates = (
  firstDate: string,
  secondDate: string,
): 'before' | 'same' | 'after' | 'error' => {
  const fMoment = getDateFromDay(firstDate)
  const sMoment = getDateFromDay(secondDate)

  if (!fMoment.isValid() || !sMoment.isValid()) {
    return 'error'
  }

  if (fMoment.isBefore(sMoment)) {
    return 'before'
  }

  if (fMoment.isAfter(sMoment)) {
    return 'after'
  }

  return 'same'
}

export const compareWithToday = (date: string) => {
  return compareDates(date, moment().format(DATE_FORMATS.date))
}

export const getTodayString = (format: string = DATE_FORMATS.date) => {
  return moment().format(format)
}

export const getDateFromDay = (day: DateShape) => {
  return moment(formatDateFromPicker(day), DATE_FORMATS.date)
}

export default DateFormat
