import { useState, useEffect } from 'react'

export function useHasEthereum() {
  const [isEthereumAvailable, setIsEthereumAvailable] = useState(false)

  useEffect(() => {
    let intervalId: number

    function checkForEthereum() {
      if (window.ethereum) {
        setIsEthereumAvailable(true)
        clearInterval(intervalId)
      }
    }

    intervalId = setInterval(checkForEthereum, 100) as unknown as number

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return isEthereumAvailable
}