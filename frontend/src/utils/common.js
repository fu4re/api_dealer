import { Ref } from 'react'
import ReactDom from 'react-dom'
import moment from 'moment'
import 'moment-precise-range-plugin'
import isString from 'lodash/isString'
import toLower from 'lodash/toLower'
import padStart from 'lodash/padStart'
import get from 'lodash/get'
import size from 'lodash/size'
import isFunction from 'lodash/isFunction'
import reduce from 'lodash/reduce'
import Qs from 'qs'
import { CURRENCY_SYMBOLS, CURRENCIES } from 'constants/common'
import { getDateFromDay } from 'utils/date-time'
import type { SelectorValueType } from 'components/selects/Selector'
import type {
  DropDownItemType,
  DropDownValueKey,
} from 'components/base/dropdown/DropDown'

export const MONTHS_IN_YEAR = 12

export const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
    navigator.userAgent,
  )

export const stopPropagationEvent = (event: MouseEvent<HTMLDivElement>) => {
  event?.stopPropagation()
}

export const removeSymbols = (str: string, symbols: Array<string>) => {
  if (!isString(str) || !Array.isArray(symbols)) {
    return ''
  }

  if (size(symbols) === 0) {
    return str
  }

  return removeSymbols(replaceAll(str, symbols[0], ''), symbols.slice(1))
}

export const getQueryParams = () => parseQuery(window.location.search)

export const parseQuery = (queryString: string) => {
  const query = {}
  const str = queryString[0] === '?' ? queryString.substr(1) : queryString
  const pairs = str.split('&')

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=')
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
  }

  return query
}

export const parseQueryParams = (queryString: string): Record<string, string> => {
  return Qs.parse(queryString, { ignoreQueryPrefix: true })
}

export const getQueryParam = (queryString: string, paramName: string): string => {
  const params = parseQueryParams(queryString)
  return params?.[paramName]
}

export const wait = (ms: number = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const getElementRectByRef = (ref: Ref) => {
  const element = ReactDom.findDOMNode(ref.current)
  return element ? element.getBoundingClientRect() : {}
}

export const getSelectIndexOptions = (count: number, padLength: number = 0) => {
  return Array.from(Array(count).keys()).map((v) => ({
    id: v + 1,
    title: padLength ? padStart(v + 1, padLength, '0') : v + 1,
  }))
}

export const getNoun = (
  value: number,
  strings: { base: string, one: string, two: string },
) => {
  const { one, two, base } = strings

  let n = Math.abs(value)
  n %= 100

  if (n >= 5 && n <= 20) {
    return base
  }

  n %= 10
  if (n === 1) {
    return one
  }

  if (n >= 2 && n <= 4) {
    return two
  }

  return base
}

export const toArrayIfNot = (value: any) => (Array.isArray(value) ? value : [value])

export const replaceAll = (str: string, find: string, replacement: string) => {
  return str?.split(find)?.join(replacement)
}

export const getMaskFromFormat = (format: string) => {
  return replaceAll(replaceAll(format, '9', '\\9'), 'x', '9')
}

const nounsById = {
  days: { base: 'дней', one: 'день', two: 'дня' },
  months: { base: 'месяцев', one: 'месяц', two: 'месяца' },
  symbols: { base: 'символов', one: 'символ', two: 'символа' },
  elements: { base: 'элементов', one: 'элемент', two: 'элемента' },
  years: { base: 'лет', one: 'год', two: 'года' },
}

export const getNounByKey = (
  key: $Keys<typeof nounsById>,
  count: number,
  renderCount: boolean,
) => {
  const strings = nounsById[key]

  if (strings) {
    return [renderCount && count, getNoun(count, strings)].filter(Boolean).join(' ')
  }

  console.warn(`Not found noun with key ${key}`, nounsById)
  return renderCount ? count : ''
}

export const replaceWithHtml = (
  text: string,
  textToReplace: string,
  replaceValue: any,
  replaceAllEntries: boolean = false,
): any[] => {
  const delimiter = '|||||'
  const newTextToReplace = `${delimiter}${textToReplace}${delimiter}`

  return text?.includes(textToReplace)
    ? (replaceAllEntries
        ? replaceAll(text, textToReplace, newTextToReplace)
        : text.replace(textToReplace, newTextToReplace)
      )
        .split(delimiter)
        .map((i) => (i === textToReplace ? replaceValue : i || null))
    : text
}

export const replaceLineBreaksWithHtml = (text: string) => {
  return replaceWithHtml(replaceAll(text, '\n', '/n'), '/n', <br />, true)
}

export const sortByAlphabet = (array: Array<Record<string, any>>, sortKey: string) => {
  return array
    .slice(0)
    .sort((a, b) => toLower(get(a, sortKey))?.localeCompare(toLower(get(b, sortKey))))
}

export const getModifiers = (
  prefix: string,
  modifiers: string | Array<string>,
  divider: string = '--',
) => {
  return [prefix, ...toArrayIfNot(modifiers)].filter(Boolean).join(divider)
}

export const format = (value: number) => padStart(value.toString(), 2, '0')

export const areDropItemsEqual = (a, b) => Boolean(a) && Boolean(b) && a.id === b.id

export const getSelectorOptions = (
  options: Array<SelectorValueType>,
  titleCallback?: (value: SelectorValueType) => SelectorValueType,
) => {
  return options.map((el) => ({ title: titleCallback?.(el) ?? el, id: el }))
}

export const formatOption = (item: Record<string, any>) => ({
  label: item.displayname,
  value: item.id,
  initialData: item,
  ...(Array.isArray(item.childs) && size(item.childs) > 0
    ? { childs: item.childs.map(formatOption) }
    : {}),
})

export const getInitialValues = (
  value: boolean | number | string,
  names: Array<string>,
) => {
  return reduce(
    names,
    (acc, key) => {
      acc[key] = value
      return acc
    },
    {},
  )
}

export const getDropDownItemValue = (valueKey: DropDownKey, item: DropDownItemType) => {
  return isFunction(valueKey) ? valueKey(item) : item?.[valueKey]
}

export const getDropDownItemLabel = (
  valueKey: DropDownValueKey,
  item: DropDownItemType,
) => {
  return item.label || getDropDownItemValue(valueKey, item)
}

export const removeUrl = (str: string) => str.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')

export const getDateInfo = (from: DateShape, to: DateShape) => {
  const { months, days, years } = moment.preciseDiff(from, to, true)

  const monthsCount = years * MONTHS_IN_YEAR + months
  const monthsLabel = Boolean(monthsCount) && getNounByKey('months', monthsCount, true)
  const daysLabel = Boolean(days) && getNounByKey('days', days, true)

  return { monthsCount, monthsLabel, daysLabel, days }
}

export const getDatesLabel = (value: DateRange) => {
  if (!value.from || !value.to) {
    return null
  }

  const from = getDateFromDay(value.from)
  const to = getDateFromDay(value.to)

  const { monthsLabel, daysLabel } = getDateInfo(from, to)

  return [monthsLabel, daysLabel].filter(Boolean).join(' и ')
}

export const compare = (a: any, b: any, orderBy: string) => {
  const first = a[orderBy]
  const second = b[orderBy]

  if ([first, second].every(isString)) {
    return toLower(first).localeCompare(toLower(second))
  }

  if ([first, second].every(isFinite)) {
    return second - first
  }
}

export const getComparator = (order: string, orderBy: string) => {
  return (a, b) => compare(a, b, orderBy) * (order === 'desc' ? 1 : -1)
}

export const reverseString = (string: string) => {
  return string.split('').reverse().join('')
}

export const divideByThousands = (number: number) => {
  let result = ''
  let count = 0
  let str = String(number)

  while (size(str) > 0) {
    let divider = ''

    if (count === 2) {
      divider = ' '
      count = 0
    } else {
      count++
    }

    const lastIndex = size(str) - 1
    result += str[lastIndex] + divider
    str = str.slice(0, lastIndex)
  }

  return reverseString(result.trim())
}

export const formatPrice = (
  value: number = 0,
  currency: string = CURRENCIES.rub,
  noSymbol: boolean = false,
) => {
  const isNegative = value < 0
  const resultValue = isNegative ? -value : value

  const formatted = [
    divideByThousands(resultValue),
    !noSymbol && CURRENCY_SYMBOLS[currency],
  ]
    .filter(Boolean)
    .join(' ')

  return [isNegative && '-', formatted].filter(Boolean).join('')
}

export const formatYears = (value: number) => getNounByKey('years', value, true)

export const formatPercent = (value: number) => `${value} %`

export const parseNumber = (value: any) => {
  return isString(value) ? +removeSymbols(value, [' ']) : value
}
