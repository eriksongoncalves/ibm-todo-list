import AsyncStorage from '@react-native-async-storage/async-storage'
import { createContext, useContext, useEffect, useState } from 'react'
import auth from '@react-native-firebase/auth'

import * as types from './types'

const STORAGE_USER_KEY = '@todoList:user'

const AuthContext = createContext<types.AuthContextProps>(
  {} as types.AuthContextProps
)

const AuthProvider = ({ children }: types.AuthProviderProps) => {
  const [user, setUser] = useState<types.User>()
  const [loading, setLoading] = useState(true)

  const signIn = async (credentials: types.SignInCredentials) => {
    try {
      setLoading(true)

      const { user } = await auth().signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      )

      console.log('>>> auth', user)

      // await AsyncStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));

      // setUser(userData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('>>> signIn error', error)
      throw new Error('Login ou senha inválidos')
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (data: types.SignUpInput) => {
    try {
      setLoading(true)
      // eslint-disable-next-line no-console
      console.log('>>> data', data)
    } catch (error) {
      throw new Error('Ocorreu um erro ao tentar se cadastrar')
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_USER_KEY)
      setUser(undefined)
    } catch (error) {
      throw new Error('Ocorreu um erro ao tentar fazer logout')
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true)
      // eslint-disable-next-line no-console
      console.log('>>> email', email)
    } catch (error) {
      throw new Error('Ocorreu um erro ao tentar enviar o e-mail')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: types.UpdateProfileInput) => {
    try {
      setLoading(true)
      // eslint-disable-next-line no-console
      console.log('>>> data', data)
    } catch (error) {
      throw new Error('Ocorreu um erro ao tentar se cadastrar')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true)
        const storageUserData = await AsyncStorage.getItem(STORAGE_USER_KEY)

        if (storageUserData) {
          const userData = JSON.parse(storageUserData) as types.User

          setUser(userData)
        }
      } finally {
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
