import { renderHook } from '@utils/test-utils'

import { useDebounce } from '../useDebounce'

const mockFn = jest.fn()

describe('useDebounce hook', () => {
  jest.useFakeTimers()

  it('should be call the mockFn after 500ms', () => {
    const { result } = renderHook(() => useDebounce())

    result.current.debounce(mockFn)

    jest.advanceTimersByTime(200)

    expect(mockFn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(300)

    expect(mockFn).toHaveBeenCalled()
  })

  it('should be canceled the last call to the mockFn and reset the counter', () => {
    mockFn.mockReset()

    const { result } = renderHook(() => useDebounce())

    // VAI FAZER UMA CHAMADA NA mockFn DEPOIS DE 500ms
    result.current.debounce(mockFn)

    jest.advanceTimersByTime(200)

    // VAI CANCELAR A CHAMADA ANTERIOR E O CONTADOR E FAZER UMA NOVA DEPOIS DE 500ms
    result.current.debounce(mockFn, 500)

    jest.advanceTimersByTime(300)

    expect(mockFn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(200)

    expect(mockFn).toHaveBeenCalled()
  })

  it('should be call the mockFn after 1000ms', () => {
    mockFn.mockReset()

    const { result } = renderHook(() => useDebounce())

    result.current.debounce(mockFn, 1000)

    jest.advanceTimersByTime(600)

    expect(mockFn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(400)

    expect(mockFn).toHaveBeenCalled()
  })
})
