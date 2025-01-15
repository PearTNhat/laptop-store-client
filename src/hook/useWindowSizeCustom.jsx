import { useEffect, useState } from 'react'

function useWindowSizeCustom() {
  const isWindowClient = typeof window === 'object'
  const [windowSize, setWindowSize] = useState(
    isWindowClient ? { width: window.innerWidth, height: window.innerHeight } : undefined
  )
  useEffect(() => {
    const setSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    if (isWindowClient) {
      window.addEventListener('resize', setSize)
    }
    return () => window.removeEventListener('resize', setSize)
  }, [isWindowClient])
  return {
    width: windowSize.width,
    height: windowSize.height
  }
}

export default useWindowSizeCustom
