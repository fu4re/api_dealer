import React, { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

const WithRouter = (Component: ReactNode) => {
  const Wrapper = (props) => {
    const navigate = useNavigate()
    return <Component navigate={navigate} {...props} />
  }

  return Wrapper
}

export default WithRouter
