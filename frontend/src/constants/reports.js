import { formatPrice, formatPercent } from 'utils/common'

export const TABLE_NAMES = {
  funnelCount: 'funnel_count',
  funnelSum: 'funnel_sum',
  incomeCount: 'income_count',
  incomeSum: 'income_sum',
}

export const FUNNEL_TABLES = [TABLE_NAMES.funnelCount, TABLE_NAMES.funnelSum]
export const INCOME_TABLES = [TABLE_NAMES.incomeCount, TABLE_NAMES.incomeSum]

export const REPORTS_TABS_IDS = {
  count: 'count',
  sum: 'sum',
}

export const REPORTS_TABLE_KEYS = {
  funnel: 'funnel',
  income: 'income',
}

export const REPORTS_TABS = [
  { id: REPORTS_TABS_IDS.count, text: 'Количество' },
  { id: REPORTS_TABS_IDS.sum, text: 'Сумма' },
]

export const blocks = [
  { title: 'Воронка продаж', key: REPORTS_TABLE_KEYS.funnel },
  {
    title: 'Доход диллера от продажи финансовых услуг',
    key: REPORTS_TABLE_KEYS.income,
    cardTitle: 'Кумулятивная маржа на 1 продажу',
  },
]

export const VALUE_MODIFIERS = {
  approve_level: formatPercent,
  avg_loan: formatPrice,
  total_loan: formatPrice,
  avg_car_price: formatPrice,
  mean_square: formatPrice,
  fraction: formatPercent,
}

export const STATS = {
  [REPORTS_TABLE_KEYS.funnel]: [
    [
      { id: 'approve_level', title: 'Уровень одобрения' },
      { id: 'avg_loan', title: 'Средний размер' },
    ],
    [
      { id: 'total_loan', title: 'Сумма выданных кредитов' },
      { id: 'avg_car_price', title: 'Средняя цена автомобиля' },
    ],
  ],
  [REPORTS_TABLE_KEYS.income]: [
    [{ id: 'mean_square', title: 'Среднее КВ' }],
    [{ id: 'fraction', title: 'Доля' }],
  ],
}
