import { useContext } from 'react'
import { PenpalContext } from './PenpalProvider'

export function usePenpal () {
  return useContext(PenpalContext)
}
