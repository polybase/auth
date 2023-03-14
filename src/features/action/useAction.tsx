import { useContext } from 'react'
import { ActionContext } from './ActionProvider'

export function useAction() {
  return useContext(ActionContext)
}
