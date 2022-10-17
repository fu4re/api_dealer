import { FIELDS, PERSONAL_FIELDS } from 'constants/fields'
import { formatPrice, formatYears, formatPercent } from 'utils/common'

export const VALUE_MODIFIERS = {
  percent: formatPercent,
  sum: formatPrice,
  month_repayment: formatPrice,
  term: formatYears,
}

export const BASE_RESULTS = [
  [
    { id: 'percent', title: 'Ставка' },
    { id: 'sum', title: 'Сумма кредита' },
  ],
  [
    { id: 'month_payment', title: 'Платёж в месяц' },
    { id: 'term', title: 'Срок' },
  ],
].map((i) => {
  return i.map((item) => ({
    ...item,
    value: null,
    valueModifier: VALUE_MODIFIERS[item.id],
  }))
})

export const PRESCORING_FIELDS = [...PERSONAL_FIELDS, FIELDS.birthPlace, FIELDS.salary]

export const PRESCORE_STATUSES = {
  denied: 'prescore_denied',
  approved: 'prescore_approved',
}
