import { createSlice } from '@reduxjs/toolkit'
import reduce from 'lodash/reduce'
import { fetchAuth, fetchRegister, fetchAuthMe } from 'store/Settings/actions'
import { REQUEST_STATUSES, STATUSES } from 'constants/store'

const initialState = {
  data: null,
  status: 'loading',
}

const reducersByStatus = {
  [REQUEST_STATUSES.PENDING]: (state) => {
    state.data = null
    state.status = 'loading'
  },
  [REQUEST_STATUSES.FULFILLED]: (state, action) => {
    state.data = action.payload
    state.status = 'loaded'
  },
  [REQUEST_STATUSES.REJECTED]: (state) => {
    state.data = null
    state.status = 'error'
  },
}

const actions = [fetchAuth, fetchAuthMe, fetchRegister]

const extraReducers = reduce(
  actions,
  (acc, action) => {
    STATUSES.forEach((status) => (acc[action[status]] = reducersByStatus[status]))
    return acc
  },
  {},
)

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null
    },
  },
  extraReducers,
})

export const isAuthSelector = ({ settings }) => Boolean(settings.data)
export const dataSelector = ({ settings }) => settings.data || {}

export const settingsReducer = settingsSlice.reducer

export const { logout } = settingsSlice.actions
