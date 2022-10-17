import React from 'react'
import './required.scss'

export type RequiredMarkProps = {
  is: boolean,
  needSpace?: boolean,
}

const RequiredMark = (props: RequiredMarkProps) => {
  const { is, needSpace = false } = props

  return is ? <span className="required-mark">{needSpace && <>&nbsp;</>}*</span> : null
}

export default RequiredMark
