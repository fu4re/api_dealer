import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import size from 'lodash/size'
import Preloader from 'components/base/preloader/Preloader'
import { dataSelector } from 'store/Settings/reducers'
import { ROUTER_PATHS } from 'constants/router'

const Home = () => {
  const userData = useSelector(dataSelector)

  if (!window.localStorage.getItem('token')) {
    return <Navigate to={ROUTER_PATHS.LOGIN} />
  }

  if (size(userData) === 0) {
    return <Preloader size={80} />
  }

  return <Navigate to={ROUTER_PATHS.CRM} />
}

export default Home
