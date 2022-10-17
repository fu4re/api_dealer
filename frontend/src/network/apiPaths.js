import size from 'lodash/size'

export const API_PREFIXES = {
  USERS: '/users',
  LOAN: '/loan',
  REPORTS: '/reports',
  MARKETPLACE: '/marketplace',
}

const { USERS, LOAN, REPORTS, MARKETPLACE } = API_PREFIXES

export const getPath = (parts: Array<string>) => parts.join('/')

export const getRequestPath = (ending: string = '') => {
  return [LOAN, '/requests', ending].join('')
}

export const getReportsPath = (params: Record<string, any> = {}) => {
  return [REPORTS, size(params) > 0 && `?date_from=${params.from}&date_to=${params.to}`]
    .filter(Boolean)
    .join('')
}

export const API_PATHS = {
  MARKETPLACE,
  REPORTS: getReportsPath,
  ME: getPath([USERS, 'me']),
  LOGIN: getPath([USERS, 'login']),
  REGISTER: getPath([USERS, 'registrate']),
  REQUEST: getPath([LOAN, 'request_document']),
  REQUEST_FORM: getPath([LOAN, 'form']),
  CALCULATE: getPath([LOAN, 'calculate']),
  PRESCORE: getPath([LOAN, 'prescore']),
  TABLE: (archive: boolean = false) => getRequestPath(`?archive=${archive}`),
  RESTORE: getRequestPath('/active'),
  ARCHIVE: getRequestPath('/archive'),
}
