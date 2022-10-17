import React, { useEffect } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ThemeProvider as MuiThemeProvider, createTheme } from '@material-ui/core/styles'
import { SnackbarProvider } from 'notistack'
import Home from 'pages/Home/Home'
import ErrorPage from 'pages/ErrorPage/ErrorPage'
import CRM from 'pages/CRM/CRM'
import Request from 'pages/Request/Request'
import Login from 'pages/Login/Login'
import Register from 'pages/Register/Register'
import Confirm from 'components/base/confirm/Confirm'
import ErrorBoundary from 'components/base/error/ErrorBoundary'
import { fetchAuthMe } from 'store/Settings/actions'
import { ROUTER_PATHS } from 'constants/router'
import { SnackbarUtilsConfigurator } from 'config/snackbars/snackbarConfig'
import './styles/index.scss'

export const muiTheme = createTheme({
  typography: { fontFamily: 'StyreneALC', useNextVariants: true },
  palette: { primary: { main: '#2264E6' } },
})

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
})

export const snackBarClasses = {
  variantSuccess: 'snackbar--success',
  variantError: 'snackbar--error',
  variantWarning: 'snackbar--warning',
  variantInfo: 'snackbar--info',
}

const RoutesList = () => (
  <Routes>
    <Route path={ROUTER_PATHS.HOME} element={<Home />} />
    <Route path={ROUTER_PATHS.LOGIN} element={<Login />} />
    <Route path={ROUTER_PATHS.REGISTER} element={<Register />} />
    <Route path={ROUTER_PATHS.CRM} element={<CRM />} />
    <Route path={ROUTER_PATHS.REQUEST} element={<Request />} />
    <Route path={ROUTER_PATHS.ERROR} element={<ErrorPage />} />
    <Route path="*" element={<Navigate to={ROUTER_PATHS.ERROR} replace />} />
  </Routes>
)

const App = ({ store, history }) => (
  <QueryClientProvider client={queryClient}>
    <MuiThemeProvider theme={muiTheme}>
      <ConnectedSnackbarProvider>
        <Provider store={store}>
          <BrowserRouter history={history}>
            <ErrorBoundary>
              <SnackbarUtilsConfigurator />
              <Content>
                <RoutesList />
                <Confirm ref={Confirm.setRef} />
              </Content>
            </ErrorBoundary>
          </BrowserRouter>
        </Provider>
      </ConnectedSnackbarProvider>
    </MuiThemeProvider>
  </QueryClientProvider>
)

const Content = ({ children }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    /* eslint-disable react-hooks/exhaustive-deps */
    window.localStorage.getItem('token') && dispatch(fetchAuthMe())
  }, [])

  return children
}

const ConnectedSnackbarProvider = ({ children }) => (
  <SnackbarProvider
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    classes={snackBarClasses}
  >
    {children}
  </SnackbarProvider>
)

export default App
