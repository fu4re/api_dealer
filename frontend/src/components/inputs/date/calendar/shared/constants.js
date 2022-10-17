export const MINIMUM_SELECTABLE_YEAR_SUBTRACT = 100
export const MAXIMUM_SELECTABLE_YEAR_SUM = 50

export const TYPE_SINGLE_DATE = 'SINGLE_DATE'
export const TYPE_RANGE = 'RANGE'
export const TYPE_MUTLI_DATE = 'MUTLI_DATE'

export type LocaleType =
  | string
  | {
      months?: Array<string>,
      weekDays?: Array<string>,
      weekStartingIndex?: number,
      getToday?: () => void,
      toNativeDate?: () => void,
      getMonthLength?: () => void,
      transformDigit?: () => void,
      nextMonth?: string,
      previousMonth?: string,
      openMonthSelector?: string,
      openYearSelector?: string,
      closeMonthSelector?: string,
      closeYearSelector?: string,
      from?: string,
      to?: string,
      defaultPlaceholder?: string,
      digitSeparator?: string,
      yearLetterSkip?: number,
      isRtl?: boolean,
    }
