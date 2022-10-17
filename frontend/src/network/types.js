export type UniversalRequestParams = {
  onError?: (error: string) => void,
  onFinally?: () => void,
  errorMessage?: string,
  showError?: boolean,
}

export type FetchConfigType = {
  params?: Record<string, any>,
  queryOptions?: Record<string, any>,
  dependencies?: Record<string, any>,
}

export type GetInfoSettingsType = {
  key?: string,
  params?: UniversalRequestParams,
  requestParams?: Record<string, any>,
  data?: Record<string, any>,
  pathParams?: Record<string, any>,
}
