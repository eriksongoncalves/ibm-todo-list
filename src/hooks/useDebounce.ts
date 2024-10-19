import { useRef, useCallback, useEffect } from 'react'

export const useDebounce = () => {
  const timeoutRef = useRef<any | null>(null)

  useEffect(() => {
    return () => timeoutRef.current && clearTimeout(timeoutRef.current)
  }, [])

  const debounce = useCallback((callbackFn: () => void, timeMs = 500) => {
    timeoutRef.current && clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => callbackFn(), timeMs)
  }, [])

  return {
    debounce,
    debounceTimeout: timeoutRef
  }
}
