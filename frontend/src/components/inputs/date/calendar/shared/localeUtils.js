import isString from 'lodash/isString'
import getLocaleDetails from './localeLanguages'

const utils = (locale = 'ru') => {
  const localeObject = isString(locale) ? getLocaleDetails(locale) : locale
  const {
    months: monthsList,
    getToday: localeGetToday,
    toNativeDate,
    getMonthLength,
    weekStartingIndex,
    transformDigit: getLanguageDigits,
  } = localeObject

  const getToday = () => {
    const today = new Date()

    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const day = today.getDate()

    return localeGetToday({ year, month, day })
  }

  const getMonthName = (month) => monthsList[month - 1]
  const getMonthNumber = (monthName) => monthsList.indexOf(monthName) + 1

  const getMonthFirstWeekday = (date) => {
    const gregorianDate = toNativeDate({ ...date, day: 1 })
    const weekday = gregorianDate.getDay()
    const dayIndex = weekday + weekStartingIndex

    return dayIndex % 7
  }

  const isBeforeDate = (day1, day2) => {
    return !day1 || !day2 ? false : toNativeDate(day1) < toNativeDate(day2)
  }

  const checkDayInDayRange = ({ day, from, to }) => {
    if (!day || !from || !to) {
      return false
    }

    const nativeDay = toNativeDate(day)
    const nativeFrom = toNativeDate(from)
    const nativeTo = toNativeDate(to)

    return nativeDay > nativeFrom && nativeDay < nativeTo
  }

  return {
    getToday,
    getMonthName,
    getMonthNumber,
    getMonthLength,
    getMonthFirstWeekday,
    isBeforeDate,
    checkDayInDayRange,
    getLanguageDigits,
    toNativeDate,
  }
}

export default utils
