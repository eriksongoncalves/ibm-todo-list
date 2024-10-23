import { useRef, useCallback, useEffect } from 'react'

export const useDebounce = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeoutRef = useRef<any>(null)

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
