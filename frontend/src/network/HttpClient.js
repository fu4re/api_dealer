import get from 'lodash/get'
import size from 'lodash/size'
import has from 'lodash/has'
import Axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  Canceler,
  CancelToken,
} from 'axios'
import Qs from 'qs'
import {
  alertApiError,
  maybeRedirect,
  networkLog,
  processNotAuthorizedResponse,
  processPushMessage,
  prepareParams,
} from 'network/utils'
import type { AxiosInstance } from 'axios'

export type HttpClientHandleResponse = (response: any) => void

export type GetCancelCallback = (cancel: () => void) => void

export type HttpRequestAction = {
  path: string,
  method?: 'GET' | 'POST',
  onConfirmAction: (id: string) => void,
  handleResponse?: HttpClientHandleResponse,
  getCancel?: GetCancelCallback,
  file?: Array<File>,
}

export type HttpResponseSuccess<T = Record<string, any>> = {
  success: boolean,
  responseData: T,
}

export type HttpResponseError = {
  success: boolean,
  status: number,
  message?: string,
  isCancelled?: boolean,
  responseData?: Record<string, any>,
}

export type CancelFunction = Canceler
export type GetCancel = (executor: (cancel: CancelFunction) => void) => CancelToken

export const BASE_URL = 'http://45.91.8.28:3000/api/v1'

class HttpClient {
  axios: AxiosInstance

  config = {
    paramsSerializer: (params) => Qs.stringify(params, { arrayFormat: 'repeat' }), // QS сам кодирует параметры
    validateStatus: (status) => status >= 200 && status < 300,
    baseURL: BASE_URL,
  }

  constructor() {
    this.axios = Axios.create(this.config)
    this.axios.interceptors.response.use(this.onSuccessResponse, this.onFailResponse)
    this.axios.interceptors.request.use((config) => {
      config.headers.Authorization = window.localStorage.getItem('from_widget') || window.localStorage.getItem('token')
      return config
    })
  }

  async request(
    action: HttpRequestAction,
    params?: Record<string, any>,
    data?: Record<string, any>,
    headers?: Record<string, any>,
  ): HttpResponseSuccess {
    try {
      const resultParams = prepareParams(params, action.path)
      this.log(action, null, resultParams, data)

      let resultData = data

      if (has(action, 'file')) {
        const formData = new FormData()

        formData.append('file', action.file)
        size(data) > 0 && formData.append('json', JSON.stringify(data))

        resultData = formData
        headers = { ...headers, 'Content-Type': 'multipart/form-data' }
      }

      const requestConfig: AxiosRequestConfig = {
        url: action.path,
        method: action.method || 'GET',
        params: resultParams,
        data: resultData,
        headers,
        onConfirmAction: action.onConfirmAction,
        handleResponse: action.handleResponse,
      }

      if (action.getCancel) {
        requestConfig.cancelToken = new Axios.CancelToken(action.getCancel)
      }

      const response = await this.axios.request(requestConfig)
      this.log(action, true, response)

      return response
    } catch (e) {
      this.log(action, false, e)
      throw e
    }
  }

  throwResponseError(
    status: number,
    message: string,
    data?: {},
    isCancelled?: boolean,
  ): HttpResponseError {
    /* eslint-disable no-throw-literal */
    throw { success: false, status, message, responseData: data, isCancelled }
  }

  onSuccessResponse = async (response: AxiosResponse): HttpResponseSuccess => {
    const { data, status, config } = response

    if (processNotAuthorizedResponse(data)) {
      this.throwResponseError(401, 'Not authorized')
    }

    processPushMessage(data)

    if (data._status === 'error' || get(data.data, '_status') === 'error') {
      const message = get(data.data, '_error.message')

      alertApiError(message, get(data.data, '_error.exception'))

      if (data.reload && process.env.NODE_ENV !== 'development') {
        window.location.reload()
      } else {
        this.throwResponseError(status, message, data)
      }
    } else if (config.handleResponse) {
      config.handleResponse(data)
    } else if (get(data.data, 'success') === 'false') {
      const message = data.data.usermessage
      this.throwResponseError(status, message, data)
    }

    return { success: true, responseData: data }
  }

  onFailResponse = (error: AxiosError | any) => {
    const { response, request } = error
    let message = get(request, 'responseText', null)
    const status = get(response, 'status')

    if (!maybeRedirect(status)) {
      this.throwResponseError(status, message, null, Axios.isCancel(error))
    }
  }

  log = ({ method = 'GET', path }: HttpRequestAction, success, ...args) => {
    networkLog('HTTP', method, path, success, ...args)
  }
}

export default new HttpClient()
