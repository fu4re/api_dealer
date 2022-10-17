import React, { createContext, useContext, useMemo } from 'react'

export const SelectContext = createContext({})

export const useSelectContext = () => {
  const context = useContext(SelectContext)

  if (!context) {
    throw new Error('useSelectContext must be used within a SelectProvider')
  }

  return context
}

export type SelectProviderProps = {
  isInPortal?: false,
}

const SelectProvider = (props: SelectProviderProps) => {
  const { isInPortal } = props

  const value = useMemo(() => ({ isInPortal }), [isInPortal])
  return <SelectContext.Provider value={value} {...props} />
}

export default SelectProvider
