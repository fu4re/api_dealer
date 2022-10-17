import * as Yup from 'yup'
import size from 'lodash/size'
import reduce from 'lodash/reduce'
import { getNounByKey } from 'utils/common'
import { phoneRegExp, regExps, MASKS } from 'constants/common'

const getMessage = (min: number, type: 'min' | 'max', key: string) => {
  return [type === 'min' ? 'Минимум' : 'Максимум', getNounByKey(key, min, true)].join(' ')
}

export const VALIDATION_TEXTS = {
  required: 'Поле обязательно для заполнения',
  email: 'Неправильный адрес почты',
  phone: 'Неправильный номер телефона',
  min: (min: number) => getMessage(min, 'min', 'symbols'),
  max: (max: number) => getMessage(max, 'max', 'symbols'),
  arrayMinLength: (min: number) => getMessage(min, 'min', 'elements'),
  bool: 'Чекбокс должен быть активен',
  differentPasswords: 'Пароли не совпадают',
  positiveNumber: 'Необходимо положительное значение',
  url: 'Неправильный адрес сайта',
  passportNumber: 'Неправильный номер паспорта',
  passportCode: 'Неправильный код подразделения',
  index: 'Неправильный индекс',
}

const string = Yup.string().nullable()
const required = string.required(VALIDATION_TEXTS.required)
const minimum = (min: number) => required.min(min, VALIDATION_TEXTS.min(min))
const password = minimum(8)

export const FormValidators = {
  string,
  required,
  password,
  minimum,
  repeatPassword: password.oneOf(
    [Yup.ref('password'), null],
    VALIDATION_TEXTS.differentPasswords,
  ),
  email: required.email(VALIDATION_TEXTS.email),
  phone: required.matches(phoneRegExp, { message: VALIDATION_TEXTS.phone }),
  boolean: Yup.bool().oneOf([true], VALIDATION_TEXTS.bool),
  select: Yup.object().nullable().required(VALIDATION_TEXTS.required),
  arrayMinLength: (min: number = 1) => {
    return Yup.array().nullable().min(min, VALIDATION_TEXTS.arrayMinLength(min))
  },
  positiveNumber: Yup.number()
    .required(VALIDATION_TEXTS.required)
    .nullable()
    .positive(VALIDATION_TEXTS.positiveNumber),
  max: (max: number) => Yup.string().max(max, VALIDATION_TEXTS.max(max)),
  requiredMax: (max: number) => required.max(max, VALIDATION_TEXTS.max(max)),
  url: required.url(VALIDATION_TEXTS.url),
  ...reduce(
    ['passportNumber', 'passportCode', 'index'],
    (acc, key) => {
      acc[key] = minimum(size(MASKS[key])).matches(regExps[key], {
        message: VALIDATION_TEXTS[key],
      })
      return acc
    },
    {},
  ),
}
