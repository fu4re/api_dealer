import isString from 'lodash/isString'

const localeLanguages = {
  ru: {
    months: [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь',
    ],
    weekDays: [
      'Понедельник',
      'Вторник',
      'Среда',
      'Четверг',
      'Пятница',
      'Суббота',
      'Воскресенье',
    ],
    weekDaysShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    weekStartingIndex: 6,
    getToday: (gregorainTodayObject) => gregorainTodayObject,
    toNativeDate: ({ year, month, day }) => new Date(year, month - 1, day),
    getMonthLength: ({ year, month }) => new Date(year, month, 0).getDate(),
    transformDigit: (digit) => digit,
    nextMonth: 'Следующий месяц',
    previousMonth: 'Предыдущий месяц',
    openMonthSelector: 'Выбор месяца',
    openYearSelector: 'Выбор года',
    closeMonthSelector: 'Закрыть выбор месяца',
    closeYearSelector: 'Закрыть выбор года',
    defaultPlaceholder: 'Выбрать...',
    from: 'от',
    to: 'до',
    digitSeparator: ',',
    yearLetterSkip: 0,
    isRtl: false,
  },
}

const getLocaleDetails = (locale) => (isString(locale) ? localeLanguages[locale] : locale)

export { localeLanguages }
export default getLocaleDetails
