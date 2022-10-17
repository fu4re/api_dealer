import { routerMiddleware, connectRouter } from 'connected-react-router'
import Thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { applyMiddleware, combineReducers } from 'redux'
import { configureStore as createStore } from '@reduxjs/toolkit'
import { createBrowserHistory } from 'history'
import { settingsReducer } from 'store/Settings/reducers'

export const history = createBrowserHistory({ basename: '/' })

export const rootReducer = combineReducers({
  settings: settingsReducer,
  router: connectRouter(history),
})

const configureStore = (initialState = {}) => {
  const middleWares = [routerMiddleware(history), Thunk]

  if (process.env.NODE_ENV !== 'production') {
    middleWares.push(createLogger({ collapsed: true }))
  }

  return createStore({
    reducer: rootReducer,
    preloadedState: initialState,
    enhancers: [applyMiddleware(...middleWares)],
    devTools: true,
  })
}

const store = configureStore()
window.store = store

export type RootState = ReturnType<typeof store.getState>
export default store
