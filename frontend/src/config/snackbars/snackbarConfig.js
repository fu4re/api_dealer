/* eslint-disable react/destructuring-assignment */
import { SnackbarProps, SnackbarMessage, useSnackbar, WithSnackbarProps } from 'notistack'
import React from 'react'

let useSnackbarRef: WithSnackbarProps

const setUseSnackbarRef = (useSnackbarRefProp: WithSnackbarProps) => {
  useSnackbarRef = useSnackbarRefProp
}

type InnerProps = {
  setUseSnackbarRef: (showSnackbar: WithSnackbarProps) => void,
}

const InnerSnackbarUtilsConfigurator = (props: InnerProps) => {
  props.setUseSnackbarRef(useSnackbar())
  return null
}

export const SnackbarUtilsConfigurator = () => {
  return <InnerSnackbarUtilsConfigurator setUseSnackbarRef={setUseSnackbarRef} />
}

/* eslint-disable */
export default {
  enqueueSnackbar(message: SnackbarMessage, options: SnackbarProps = {}) {
    useSnackbarRef.enqueueSnackbar(message, options)
  },
  closeSnackbar(key) {
    useSnackbarRef.closeSnackbar(key)
  },
}
