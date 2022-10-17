import React, { ReactNode } from 'react'

export type RotateProps = {
  className?: string,
  when: boolean,
  startRotate?: number,
  endRotate?: number,
  children: ReactNode,
}

const Rotate = (props: RotateProps) => {
  const { className = '', when, children, startRotate = 0, endRotate = 180 } = props

  return (
    <div
      className={className}
      style={{
        transition: 'transform 300ms',
        transform: `rotate(${startRotate + (when ? endRotate : 0)}deg)`,
      }}
    >
      {children}
    </div>
  )
}

export default Rotate
