import { TYPE_SINGLE_DATE, TYPE_RANGE, TYPE_MUTLI_DATE } from './constants'
import has from 'lodash/has'
import size from 'lodash/size'

const createUniqueRange = (number, startingId) =>
  Array.from(Array(number).keys()).map((key) => ({
    value: key + 1,
    id: [startingId, key].join('-'),
  }))

const isSameDay = (day1, day2) => {
  if (!day1 || !day2) {
    return false
  }

  return day1.day === day2.day && day1.month === day2.month && day1.year === day2.year
}

const putZero = (number) => (size(number.toString()) === 1 ? `0${number}` : number)
const toExtendedDay = ({ year, month, day }) => [year, month, day]
const shallowClone = (value) => ({ ...value })

const getDateAccordingToMonth = (date, direction) => {
  const toSum = direction === 'NEXT' ? 1 : -1
  let newMonthIndex = date.month + toSum
  let newYear = date.year

  if (newMonthIndex < 1) {
    newMonthIndex = 12
    newYear -= 1
  }

  if (newMonthIndex > 12) {
    newMonthIndex = 1
    newYear += 1
  }

  return { year: newYear, month: newMonthIndex, day: 1 }
}

const getValueType = (value) => {
  if (Array.isArray(value)) {
    return TYPE_MUTLI_DATE
  }

  if (has(value, 'from') && has(value, 'to')) {
    return TYPE_RANGE
  }

  if (!value || (has(value, 'year') && has(value, 'month') && has(value, 'day'))) {
    return TYPE_SINGLE_DATE
  }

  throw new TypeError(
    `The passed value is malformed! Please make sure you're using one of the valid value types for date picker.`,
  )
}

export {
  createUniqueRange,
  isSameDay,
  putZero,
  toExtendedDay,
  shallowClone,
  getDateAccordingToMonth,
  getValueType,
}
