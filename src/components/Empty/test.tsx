import { render } from '@utils/test-utils'

import { Empty } from './'

const mockFn = jest.fn()

describe('Empty component', () => {
  it('should be rendered correctly', () => {
    const { getByText, getByTestId } = render(
      <Empty description="Você ainda não tem nenhum item adicionado na sua lista!" />
    )

    expect(getByText(/Você ainda não/i)).toBeTruthy()
    expect(() => getByTestId('emptyButtonAction')).toThrow()
  })

  it('should be rendered with an action button', () => {
    const { getByText, getByTestId } = render(
      <Empty
        description="Você ainda não tem nenhum item adicionado na sua lista!"
        actionDescription="Adicionar um item"
        onPress={mockFn}
      />
    )

    expect(getByText(/Você ainda não/i)).toBeTruthy()
    expect(getByText(/Adicionar um item/i)).toBeTruthy()
    expect(getByTestId('emptyButtonAction')).toBeTruthy()
  })
})
