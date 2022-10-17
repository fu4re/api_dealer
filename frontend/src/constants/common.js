export const INVISIBLE_TEXT = '‎'
export const SPECIAL_SYMBOLS = ' !#$%&\'()*+,-./:;<=>?@[\\]^_{|}~`"'

export const keysMatching = {
  q: 'й',
  w: 'ц',
  e: 'у',
  r: 'к',
  t: 'е',
  y: 'н',
  u: 'г',
  i: 'ш',
  o: 'щ',
  p: 'з',
  '[': 'х',
  ']': 'ъ',
  a: 'ф',
  s: 'ы',
  d: 'в',
  f: 'а',
  g: 'п',
  h: 'р',
  j: 'о',
  k: 'л',
  l: 'д',
  ';': 'ж',
  "'": 'э',
  z: 'я',
  x: 'ч',
  c: 'с',
  v: 'м',
  b: 'и',
  n: 'т',
  m: 'ь',
  ',': 'б',
  '.': 'ю',
  '/': '.',
}

/* eslint-disable no-useless-escape */
export const EmailRegExp =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

/* eslint-disable no-useless-escape */
export const phoneRegExp = /\+7\s\([0-9]{3}\)\s[0-9]{3}-[0-9]{2}-[0-9]{2}/

/* eslint-disable no-useless-escape */
export const regExps = {
  passportNumber: /[0-9]{4}\s[0-9]{6}/,
  passportCode: /[0-9]{3}-[0-9]{3}/,
  index: /[0-9]{6}/,
}

export const CURRENCIES = {
  rub: 'rub',
  usd: 'usd',
  eur: 'eur',
}

export const CURRENCY_SYMBOLS = {
  [CURRENCIES.rub]: '₽',
  [CURRENCIES.usd]: '$',
  [CURRENCIES.eur]: '€',
}

export const MASKS = {
  phone: '+7 (xxx) xxx-xx-xx',
  passportNumber: 'xxxx xxxxxx',
  passportCode: 'xxx-xxx',
  index: 'xxxxxx',
}
