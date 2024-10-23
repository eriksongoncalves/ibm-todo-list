import { NavigationContext } from '@react-navigation/native'

import { render, fireEvent, waitFor } from '@utils/test-utils'

import { Profile } from './'

const mockUpdateProfile = jest.fn()
const mockToast = jest.fn()
const mockUser = jest.fn(() => ({
  uid: '1',
  name: 'Teste',
  email: 'teste@teste.com.br'
}))

const navContextValue = {
  isFocused: () => true,
  addListener: jest.fn(() => jest.fn())
} as any

jest.mock('@hooks/auth', () => ({
  useAuth: () => ({
    updateProfile: () => mockUpdateProfile(),
    user: mockUser(),
    loading: false
  })
}))

jest.mock('react-native-toast-message', () => {
  return {
    show: (props: any) => mockToast(props)
  }
})

describe('Profile screen', () => {
  it('should be rendered correctly', () => {
    const { getByPlaceholderText } = render(
      <NavigationContext.Provider value={navContextValue}>
        <Profile />
      </NavigationContext.Provider>
    )

    const inputName = getByPlaceholderText(/nome/i)
    const inputEmail = getByPlaceholderText(/e-mail/i)
    const inputPassword = getByPlaceholderText('Senha (Opcional)')
    const inputConfirmPassword = getByPlaceholderText('Confirmar senha')

    expect(inputName.props.value).toBe('Teste')
    expect(inputEmail.props.value).toBe('teste@teste.com.br')
    expect(inputPassword.props.value).toBe('')
    expect(inputConfirmPassword.props.value).toBe('')
  })

  it('should not be update profile when fields are invalid', async () => {
    const { getByText, findAllByText, getByPlaceholderText } = render(
      <NavigationContext.Provider value={navContextValue}>
        <Profile />
      </NavigationContext.Provider>
    )

    const inputName = getByPlaceholderText(/nome/i)
    const inputEmail = getByPlaceholderText(/e-mail/i)

    fireEvent.changeText(inputName, '')
    fireEvent.changeText(inputEmail, '')

    const buttonText = getByText(/salvar/i)

    fireEvent.press(buttonText)

    const errors = await findAllByText(/campo obrigatório/i)

    expect(errors.length).toBe(2)
  })

  it('should be update profile', () => {
    const { getByText } = render(
      <NavigationContext.Provider value={navContextValue}>
        <Profile />
      </NavigationContext.Provider>
    )

    const buttonText = getByText(/salvar/i)

    fireEvent.press(buttonText)

    waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalled()
    })
  })

  it('should not be do signup when there is an error', async () => {
    const { getByText } = render(
      <NavigationContext.Provider value={navContextValue}>
        <Profile />
      </NavigationContext.Provider>
    )

    mockUpdateProfile.mockRejectedValueOnce(new Error('Generic error'))

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
