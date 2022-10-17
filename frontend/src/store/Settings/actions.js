import { createAsyncThunk } from '@reduxjs/toolkit'
import omit from 'lodash/omit'
import HttpClient from 'network/HttpClient'
import { API_PATHS } from 'network/apiPaths'

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params) => {
  const { responseData } = await HttpClient.request(
    { path: API_PATHS.LOGIN, method: 'POST' },
    undefined,
    params,
  )

  return responseData
})

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
  const { responseData } = await HttpClient.request(
    { path: API_PATHS.REGISTER, method: 'POST', file: params.file },
    undefined,
    omit(params, 'file'),
  )

  return responseData
})

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
  const { responseData } = await HttpClient.request({ path: API_PATHS.ME })

  return responseData
})
