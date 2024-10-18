import { render, fireEvent } from '@utils/test-utils'

import { Input } from './'

const mockFn = jest.fn()

describe('Input component', () => {
  it('should be rendered correctly', () => {
    const { getByTestId } = render(<Input />)

    expect(getByTestId('myInput')).toBeTruthy()
  })

  it('should be rendered disabled', () => {
    const { getByTestId } = render(<Input disabled />)

    const inputComponent = getByTestId('myInput')

    expect(inputComponent.props.editable).toBeFalsy()
    expect(inputComponent.props.style[0].color).toBe('#29292e')
  })

  it('should be rendered with error message', () => {
    const { getByText } = render(<Input errorMessage="Campo obrigatório" />)

    expect(getByText(/Campo obrigatório/)).toBeTruthy()
  })

  it('should be rendered with suggestions', () => {
    const { getAllByText, getByText } = render(
      <Input
        suggestions={[{ item: 'Item 1' }, { item: 'Item 2' }]}
        onSuggestionPress={mockFn}
      />
    )

    expect(getAllByText(/Item/i)).toHaveLength(2)

    fireEvent.press(getByText(/Item 1/i))

    expect(mockFn).toHaveBeenCalledWith('Item 1')
  })

  it('should be rendered with margins', () => {
    const { getByTestId } = render(<Input mb={10} mt={20} />)

    const inputComponent = getByTestId('myInput')

    expect(inputComponent.props.style[0].marginBottom).toBe(10)
    expect(inputComponent.props.style[0].marginTop).toBe(20)
  })
})
