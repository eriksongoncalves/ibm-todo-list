import { render, fireEvent, waitFor } from '@utils/test-utils'

import { SignUp } from './'

const mockSignUp = jest.fn()
const mockNavigate = jest.fn()
const mockToast = jest.fn()

jest.mock('@hooks/auth', () => ({
  useAuth: () => ({
    signUp: () => mockSignUp(),
    loading: false
  })
}))

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: () => mockNavigate()
  })
}))

jest.mock('react-native-toast-message', () => {
  return {
    show: (props: any) => mockToast(props)
  }
})

describe('SignUp screen', () => {
  it('should be rendered correctly', () => {
    const { getByText } = render(<SignUp />)

    expect(getByText(/TODO-LIST/i)).toBeTruthy()
    expect(getByText(/Crie sua conta/i)).toBeTruthy()
  })

  it('should be navigate to signin screen', () => {
    const { getByText } = render(<SignUp />)

    const buttonText = getByText(/Voltar para o login/i)

    fireEvent.press(buttonText)

    waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled()
    })
  })

  it('should not be do signup when fields are invalid', async () => {
    const { getByText, findAllByText } = render(<SignUp />)

    const buttonText = getByText(/salvar/i)

    fireEvent.press(buttonText)

    const errors = await findAllByText(/campo obrigatório/i)

    expect(errors.length).toBe(4)
  })

  it('should be do signup', () => {
    const { getByText, getByPlaceholderText } = render(<SignUp />)

    const inputName = getByPlaceholderText(/nome/i)
    const inputEmail = getByPlaceholderText(/e-mail/i)
    const inputPassword = getByPlaceholderText('Senha')
    const inputConfirmPassword = getByPlaceholderText(/confirmar senha/i)

    fireEvent.changeText(inputName, 'Teste')
    fireEvent.changeText(inputEmail, 'teste@teste.com.br')
    fireEvent.changeText(inputPassword, '123456')
    fireEvent.changeText(inputConfirmPassword, '123456')

    expect(inputName.props.value).toBe('Teste')
    expect(inputEmail.props.value).toBe('teste@teste.com.br')
    expect(inputPassword.props.value).toBe('123456')
    expect(inputConfirmPassword.props.value).toBe('123456')

    const buttonText = getByText(/salvar/i)

    fireEvent.press(buttonText)

    waitFor(() => {
      expect(mockSignUp).toHaveBeenCalled()
    })
  })

  it('should not be do signup when there is an error', async () => {
    const { getByText, getByPlaceholderText } = render(<SignUp />)

    mockSignUp.mockRejectedValueOnce(new Error('Generic error'))

    const inputName = getByPlaceholderText(/nome/i)
    const inputEmail = getByPlaceholderText(/e-mail/i)
    const inputPassword = getByPlaceholderText('Senha')
    const inputConfirmPassword = getByPlaceholderText(/confirmar senha/i)

    fireEvent.changeText(inputName, 'Teste')
    fireEvent.changeText(inputEmail, 'teste@teste.com.br')
    fireEvent.changeText(inputPassword, '123456')
    fireEvent.changeText(inputConfirmPassword, '123456')

    const buttonText = getByText(/salvar/i)

    fireEvent.press(buttonText)

    waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        visibilityTime: 2000,
        type: 'error',
        text1: 'Opss...',
        text2: 'Generic error'
      })
    })
  })
})
