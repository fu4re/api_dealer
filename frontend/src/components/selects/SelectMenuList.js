import React, { forwardRef } from 'react'
import { components } from 'react-select'
import './select.scss'

const SelectMenuList = (props, ref) => {
  const { children } = props

  return (
    <components.MenuList ref={ref} {...props} className="select-list">
      {children}
    </components.MenuList>
  )
}

export default forwardRef(SelectMenuList)
