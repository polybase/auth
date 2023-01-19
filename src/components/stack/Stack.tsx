import React from 'react'

export interface StackProps {
  children: React.ReactElement[]
  size: number
}

export function Stack ({ children, size }: StackProps) {
  return (
    <>
    {children.map((el, i) => {
      if (i === 0) {
        return el
      }
      return React.cloneElement(
        el,
        { style: { marginTop: `${size}px` } }
      )
    })}
  </>
  )
}