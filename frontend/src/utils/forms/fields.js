import size from 'lodash/size'
import { formatDateFromPicker } from 'components/inputs/date/DatePicker'
import { INPUT_TYPES } from 'components/inputs/input/Input'
import { utils } from 'components/inputs/date/calendar'
import { FIELD_TYPES } from 'components/forms/field/Field'
import { MASKS } from 'constants/common'
import { FIELDS } from 'constants/fields'

const { getToday } = utils()

export const getNumberInput = (caption: string, max: number) => ({
  fieldType: FIELD_TYPES.input,
  type: INPUT_TYPES.COUNTER,
  intMaxValue: max,
  intMinValue: 0,
  caption,
})

export const getDateInput = (caption: string) => ({
  fieldType: FIELD_TYPES.input,
  type: INPUT_TYPES.DATE,
  hasDisabledDays: false,
  datePickerMinDate: '01.01.1970',
  datePickerMaxDate: formatDateFromPicker(getToday()),
  caption,
})

export const getCurrencyInput = (caption: string, hint: string = '') => ({
  fieldType: FIELD_TYPES.input,
  type: INPUT_TYPES.CURRENCY,
  caption,
  currency: '',
  intMaxValue: 10_000_000,
  hint,
})

export const getPersonal = (
  title: string,
  prefix: string = '',
  genders: Array<Record<string, any>> = [],
) => {
  const getKey = (value: string) => [prefix, value].filter(Boolean).join('_')

  return {
    [getKey('personal')]: { fieldType: FIELD_TYPES.title, text: title },
    [getKey('personal_row_1')]: {
      blocks: {
        [getKey(FIELDS.name)]: { fieldType: FIELD_TYPES.input, caption: 'Имя' },
        [getKey(FIELDS.surname)]: {
          fieldType: FIELD_TYPES.input,
          caption: 'Фамилия',
        },
        [getKey(FIELDS.patronomic)]: {
          fieldType: FIELD_TYPES.input,
          caption: 'Отчество',
        },
      },
    },
    [getKey('personal_row_2')]: {
      blocks: {
        [getKey(FIELDS.birthday)]: getDateInput('Дата рождения'),
        [getKey(FIELDS.phone)]: {
          fieldType: FIELD_TYPES.input,
          format: MASKS.phone,
          caption: 'Телефон',
        },
        [getKey(FIELDS.email)]: { fieldType: FIELD_TYPES.input, caption: 'Почта' },
      },
    },
    ...(size(genders) > 0
      ? {
          [FIELDS.gender]: {
            fieldType: FIELD_TYPES.radio,
            radios: genders,
            isInline: true,
          },
        }
      : {}),
  }
}
