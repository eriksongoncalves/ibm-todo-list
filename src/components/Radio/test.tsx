import { fireEvent, render } from '@utils/test-utils'

import { Radio } from './'

const mockFn = jest.fn()

describe('Radio component', () => {
  it('should be rendered correctly', () => {
    const { getByTestId } = render(<Radio />)

    const icon = getByTestId('checkIcon')

    expect(icon.props.name).toBe('radio-button-off')
  })

  it('should be rendered with label', () => {
    const { getByText } = render(<Radio label="Item 1" />)

    expect(getByText(/item 1/i)).toBeTruthy()
  })

  it('should be checked when isChecked prop is true', () => {
    const { getByTestId } = render(<Radio isChecked />)

    const icon = getByTestId('checkIcon')

    expect(icon.props.name).toBe('radio-button-on')
  })

  it('should be possible to click', () => {
    const renderResult = render(<Radio onPress={mockFn} />)

    const button = renderResult.root

    fireEvent.press(button)

    expect(mockFn).toHaveBeenCalled()
  })
})
