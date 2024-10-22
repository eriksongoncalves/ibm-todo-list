import { render, fireEvent, waitFor } from '@utils/test-utils'

import { SignIn } from './'

const mockSignIn = jest.fn()
const mockNavigate = jest.fn()
const mockToast = jest.fn()

jest.mock('@hooks/auth', () => ({
  useAuth: () => ({
    signIn: () => mockSignIn(),
    loading: false
  })
}))

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: () => mockNavigate()
  })
}))

jest.mock('react-native-toast-message', () => {
  return {
    show: () => mockToast()
  }
})

describe('SignIn screen', () => {
  it('should be rendered correctly', () => {
    const { getByText } = render(<SignIn />)

    expect(getByText(/TODO-LIST/i)).toBeTruthy()
    expect(getByText(/Acesse sua conta/i)).toBeTruthy()
  })

  it('should be navigate to signup screen', () => {
    const { getByText } = render(<SignIn />)

    const buttonText = getByText(/Criar conta/i)

    fireEvent.press(buttonText)

    waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled()
    })
  })

  it('should not be do login when fields are invalid', async () => {
    const { debug, getByText, findAllByText } = render(<SignIn />)

    const buttonText = getByText(/acessar/i)

    fireEvent.press(buttonText)

    const errors = await findAllByText(/campo obrigatório/i)

    expect(errors.length).toBe(2)
  })

  it('should be do login', () => {
    const { getByText, getByPlaceholderText } = render(<SignIn />)

    const inputEmail = getByPlaceholderText(/E-mail/i)
    const inputPassword = getByPlaceholderText(/Senha/i)

    fireEvent.changeText(inputEmail, 'teste@teste.com.br')
    fireEvent.changeText(inputPassword, '123456')

    expect(inputEmail.props.value).toBe('teste@teste.com.br')
    expect(inputPassword.props.value).toBe('123456')

    const buttonText = getByText(/acessar/i)

    fireEvent.press(buttonText)

    waitFor(() => {
      expect(mockSignIn).toHaveBeenCalled()
    })
  })

  it('should not be do login when there is an error', async () => {
    const { debug, getByText, getByPlaceholderText } = render(<SignIn />)

    mockSignIn.mockRejectedValueOnce(new Error())

    const inputEmail = getByPlaceholderText(/E-mail/i)
    const inputPassword = getByPlaceholderText(/Senha/i)

    fireEvent.changeText(inputEmail, 'teste@teste.com.br')
    fireEvent.changeText(inputPassword, '123456')

    expect(inputEmail.props.value).toBe('teste@teste.com.br')
    expect(inputPassword.props.value).toBe('123456')

    const buttonText = getByText(/acessar/i)

    fireEvent.press(buttonText)

    waitFor(() => {
      expect(mockToast).toHaveBeenCalled()
    })
  })
})
