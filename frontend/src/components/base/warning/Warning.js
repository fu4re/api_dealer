import React from 'react'
import './warning.scss'

export type WarningProps = {
  text?: string | null,
}

const Warning = (props: WarningProps) => {
  const { text } = props

  if (!text) {
    return null
  }

  return (
    <div className="warning-text">
      <label>{'Вниманиe!'}</label>
      {text}
    </div>
  )
}

export default Warning
