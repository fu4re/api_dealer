import isFunction from 'lodash/isFunction'
import HttpClient from 'network/HttpClient'
import { API_PATHS } from 'network/apiPaths'

export const getTable = (archive: boolean) => {
  return HttpClient.request({ path: API_PATHS.TABLE(archive), method: 'GET' })
}

const getAction = (key: string, params: Record<string, any> = {}) => {
  const path = API_PATHS[key]

  return HttpClient.request({
    path: isFunction(path) ? path(params) : path,
    method: 'GET',
  })
}

const sendAction = (key: string, data: any, method: string = 'POST') => {
  return HttpClient.request({ path: API_PATHS[key], method }, undefined, data)
}

export const sendRequest = (data: any) => sendAction('REQUEST', data)
export const prescore = (data: any) => sendAction('PRESCORE', data)
export const calculate = (data: any) => sendAction('CALCULATE', data)
export const restoreItems = (data: any) => sendAction('RESTORE', data, 'PATCH')
export const archiveItems = (data: any) => sendAction('ARCHIVE', data, 'PATCH')

export const getReports = (params: Record<string, any>) => getAction('REPORTS', params)
export const getCars = () => getAction('MARKETPLACE')
export const getRequestFormData = () => getAction('REQUEST_FORM')
