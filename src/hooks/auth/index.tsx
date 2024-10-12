import { createContext, useContext, useEffect, useState } from 'react'
import { ReactNativeFirebase } from '@react-native-firebase/app'
import auth from '@react-native-firebase/auth'
import { useNetInfo } from '@react-native-community/netinfo'

import * as types from './types'

class NoInternetError extends Error {
  constructor() {
    super('Parece que você está sem internet, conecte-se para continuar.')
  }
}

const AuthContext = createContext<types.AuthContextProps>(
  {} as types.AuthContextProps
)

const AuthProvider = ({ children }: types.AuthProviderProps) => {
  const [user, setUser] = useState<types.User>()
  const [loading, setLoading] = useState(true)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const netInfo = useNetInfo()

  const verifyInternet = () => {
    if (!netInfo.isConnected) {
      throw new NoInternetError()
    }
  }

  const updateUserDataFromCurrentUserFirebase = () => {
    const currentUser = auth().currentUser

    if (currentUser) {
      const userData: types.User = {
        id: currentUser.uid,
        name: currentUser.displayName!,
        email: currentUser.email!
      }

      setUser(userData)
    }
  }

  const signIn = async (credentials: types.SignInCredentials) => {
    try {
      setLoading(true)

      verifyInternet()

      await auth().signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      )

      updateUserDataFromCurrentUserFirebase()
    } catch (error) {
      const errorMessage =
        error instanceof NoInternetError
          ? error.message
          : 'Login ou senha inválidos'

      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (data: types.SignUpInput) => {
    try {
      setLoading(true)

      verifyInternet()

      const { user } = await auth().createUserWithEmailAndPassword(
        data.email,
        data.password
      )

      await user.updateProfile({
        displayName: data.name
      })
    } catch (err) {
      if (err instanceof NoInternetError) {
        throw new Error(err.message)
      }

      const error = err as ReactNativeFirebase.NativeFirebaseError

      if (error?.code === 'auth/email-already-in-use') {
        throw new Error('Já existe um usuário cadastrado com esse e-mail')
      }

      if (error?.code === 'auth/invalid-email') {
        throw new Error('E-mail inválido')
      }

      throw new Error(
        'Ocorreu um erro ao tentar salvar os dados, tente novamente mais tarde'
      )
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await auth().signOut()
      setUser(undefined)
    } catch (error) {
      throw new Error('Ocorreu um erro ao tentar fazer logout')
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true)

      verifyInternet()

      await auth().sendPasswordResetEmail(email)
    } catch (error) {
      const errorMessage =
        error instanceof NoInternetError
          ? error.message
          : 'Ocorreu um erro ao tentar enviar o e-mail'

      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: types.UpdateProfileInput) => {
    try {
      setLoading(true)

      verifyInternet()

      const currentUser = auth().currentUser

      if (currentUser?.email !== data.email) {
        await auth().currentUser?.updateEmail(data.email)
      }

      if (currentUser?.displayName !== data.name) {
        await currentUser?.updateProfile({
          displayName: data.name
        })
      }

      if (data.password) {
        await auth().currentUser?.updatePassword(data.password)
      }

      updateUserDataFromCurrentUserFirebase()
    } catch (err) {
      if (err instanceof NoInternetError) {
        throw new Error(err.message)
      }

      const error = err as ReactNativeFirebase.NativeFirebaseError

      if (error?.code === 'auth/email-already-in-use') {
        throw new Error('Já existe um outro usuário cadastrado com esse e-mail')
      }

      throw new Error(
        'Ocorreu um erro ao tentar salvar os dados, tente novamente mais tarde'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true)

        updateUserDataFromCurrentUserFirebase()
      } finally {
        setIsInitialLoading(false)
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isInitialLoading,
        signIn,
        signOut,
        signUp,
        forgotPassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  return useContext(AuthContext)
}

export { AuthProvider, useAuth }
