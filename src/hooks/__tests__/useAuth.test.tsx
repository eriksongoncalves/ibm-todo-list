import { act, renderHook } from '@utils/test-utils'
import { AuthProvider } from '@hooks/auth'

import { useAuth } from '../auth'

const credentialsMock = {
  email: 'teste@teste.com.br',
  password: '123456'
}

const mockSignInWithEmailAndPasswordFn = jest
  .fn()
  .mockImplementation((email, password) => {
    if (email === 'teste@teste.com.br' && password === '123456') {
      mockUser.mockImplementation(() => mockUserFilled)
      return Promise.resolve('OK')
    }

    return Promise.reject()
  })

const mockUpdateProfile = jest.fn()
const mockCreateUserWithEmailAndPassword = jest.fn().mockResolvedValue({
  user: {
    updateProfile: mockUpdateProfile
  }
})
const mockSignOut = jest.fn()
const mockSendPasswordResetEmail = jest.fn()
const mockUpdateEmail = jest.fn()
const mockUpdatePassword = jest.fn()
const mockNetInfo = jest.fn(() => ({ isConnected: true }))

const mockUserEmpty = {
  uid: '',
  email: '',
  displayName: '',
  updateEmail: mockUpdateEmail,
  updatePassword: mockUpdatePassword,
  updateProfile: mockUpdateProfile
}

const mockUserFilled = {
  uid: '1',
  displayName: 'Teste',
  email: credentialsMock.email,
  updateEmail: mockUpdateEmail,
  updatePassword: mockUpdatePassword,
  updateProfile: mockUpdateProfile
}

const mockUser = jest.fn(() => mockUserEmpty)

jest.mock('@react-native-community/netinfo', () => ({
  useNetInfo: () => mockNetInfo()
}))

jest.mock('@react-native-firebase/auth', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    signInWithEmailAndPassword: mockSignInWithEmailAndPasswordFn,
    createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
    signOut: mockSignOut,
    sendPasswordResetEmail: mockSendPasswordResetEmail,
    currentUser: mockUser()
  }))
}))

describe('useAuth hook', () => {
  it('should not be sign in when there is no internet', async () => {
    mockNetInfo.mockReturnValue({ isConnected: false })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    await act(async () => {
      expect(
        async () => await result.current.signIn(credentialsMock)
      ).rejects.toThrow(
        'Parece que você está sem internet, conecte-se para continuar.'
      )
    })
  })

  it('should be sign in', async () => {
    mockNetInfo.mockReturnValue({ isConnected: true })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    await act(async () => {
      await result.current.signIn(credentialsMock)

      expect(mockSignInWithEmailAndPasswordFn).toHaveBeenCalledWith(
        credentialsMock.email,
        credentialsMock.password
      )

      expect(result.current.user?.id).toBe('1')
      expect(result.current.user?.name).toBe('Teste')
      expect(result.current.user?.email).toBe('teste@teste.com.br')
    })
  })

  it('should not be sign in with wrong credentials', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    await act(async () => {
      await expect(
        async () =>
          await result.current.signIn({
            email: 'other@teste.com.br',
            password: '123456'
          })
      ).rejects.toThrow('Login ou senha inválidos')
    })
  })

  it('should not be sign up when there is no internet', async () => {
    mockNetInfo.mockReturnValue({ isConnected: false })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    await act(async () => {
      expect(
        async () =>
          await result.current.signUp({
            email: 'teste@teste.com.br',
            name: 'teste',
            password: '123456'
          })
      ).rejects.toThrow(
        'Parece que você está sem internet, conecte-se para continuar.'
      )
    })
  })

  it('should be sign up', async () => {
    mockNetInfo.mockReturnValue({ isConnected: true })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    await act(async () => {
      await result.current.signUp({
        email: 'teste@teste.com.br',
        name: 'Teste',
        password: '123456'
      })

      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
        'teste@teste.com.br',
        '123456'
      )

      expect(mockUpdateProfile).toHaveBeenCalledWith({
        displayName: 'Teste'
      })
    })
  })

  it('should not be sign up when email is already in use', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    mockCreateUserWithEmailAndPassword.mockRejectedValue({
      code: 'auth/email-already-in-use'
    })

    await act(async () => {
      await expect(
        async () =>
          await result.current.signUp({
            email: 'teste@teste.com.br',
            name: 'Teste',
            password: '123456'
          })
      ).rejects.toThrow('Já existe um usuário cadastrado com esse e-mail')
    })
  })

  it('should not be sign up when email is invalid', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    mockCreateUserWithEmailAndPassword.mockRejectedValue({
      code: 'auth/invalid-email'
    })

    await act(async () => {
      await expect(
        async () =>
          await result.current.signUp({
            email: 'teste@teste.c',
            name: 'Teste',
            password: '123456'
          })
      ).rejects.toThrow('E-mail inválido')
    })
  })

  it('should not be sign up when another error occurred', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    mockCreateUserWithEmailAndPassword.mockRejectedValue(new Error())

    await act(async () => {
      await expect(
        async () =>
          await result.current.signUp({
            email: 'teste@teste.com.br',
            name: 'Teste',
            password: '123456'
          })
      ).rejects.toThrow(
        'Ocorreu um erro ao tentar salvar os dados, tente novamente mais tarde'
      )
    })
  })

  it('should be sign out', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    await act(async () => {
      await result.current.signOut()

      expect(mockSignOut).toHaveBeenCalledWith()
    })

    expect(result.current.user).toBeUndefined()
  })

  it('should not be sign out', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    mockSignOut.mockRejectedValueOnce(new Error())

    await act(async () => {
      await expect(async () => await result.current.signOut()).rejects.toThrow(
        'Ocorreu um erro ao tentar fazer logout'
      )
    })
  })

  it('should not be update profile when there is no internet', async () => {
    mockNetInfo.mockReturnValue({ isConnected: false })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    await act(async () => {
      expect(
        async () =>
          await result.current.updateProfile({
            name: 'Teste',
            email: 'teste@teste.com.br'
          })
      ).rejects.toThrow(
        'Parece que você está sem internet, conecte-se para continuar.'
      )
    })
  })

  it('should be successful profile update when no data is changed', async () => {
    mockNetInfo.mockReturnValue({ isConnected: true })
    mockUpdateProfile.mockReset()
    mockUser.mockImplementation(() => mockUserFilled)

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    await act(async () => {
      await result.current.updateProfile({
        name: 'Teste',
        email: 'teste@teste.com.br'
      })

      expect(mockUpdateProfile).not.toHaveBeenCalled()
      expect(mockUpdateEmail).not.toHaveBeenCalled()
      expect(mockUpdatePassword).not.toHaveBeenCalled()
    })
  })

  it('should be update profile email', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    await act(async () => {
      await result.current.updateProfile({
        name: 'Teste',
        email: 'teste1@teste.com.br'
      })

      expect(mockUpdateEmail).toHaveBeenCalled()
      expect(mockUpdateProfile).not.toHaveBeenCalled()
      expect(mockUpdatePassword).not.toHaveBeenCalled()
    })
  })

  it('should be update profile password', async () => {
    mockUpdateEmail.mockReset()
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    await act(async () => {
      await result.current.updateProfile({
        name: 'Teste',
        email: 'teste@teste.com.br',
        password: '123456'
      })

      expect(mockUpdatePassword).toHaveBeenCalled()
      expect(mockUpdateEmail).not.toHaveBeenCalled()
      expect(mockUpdateProfile).not.toHaveBeenCalled()
    })
  })

  it('should be update profile name', async () => {
    mockUpdatePassword.mockReset()
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    await act(async () => {
      await result.current.updateProfile({
        name: 'Teste 1',
        email: 'teste@teste.com.br'
      })

      expect(mockUpdateProfile).toHaveBeenCalled()
      expect(mockUpdatePassword).not.toHaveBeenCalled()
      expect(mockUpdateEmail).not.toHaveBeenCalled()
    })
  })

  it('should not be update profile when email is already in use', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    mockUpdateEmail.mockRejectedValue({
      code: 'auth/email-already-in-use'
    })

    await act(async () => {
      await expect(
        async () =>
          await result.current.updateProfile({
            email: 'teste1@teste.com.br',
            name: 'Teste'
          })
      ).rejects.toThrow('Já existe um outro usuário cadastrado com esse e-mail')
    })
  })

  it('should not be update profile when another error occurred', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    mockUpdateEmail.mockRejectedValue(new Error())

    await act(async () => {
      await expect(
        async () =>
          await result.current.updateProfile({
            email: 'teste1@teste.com.br',
            name: 'Teste'
          })
      ).rejects.toThrow(
        'Ocorreu um erro ao tentar salvar os dados, tente novamente mais tarde'
      )
    })
  })
})
