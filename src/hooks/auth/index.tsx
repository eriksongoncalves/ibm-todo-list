import { createContext, useContext, useEffect, useState } from 'react'
import { ReactNativeFirebase } from '@react-native-firebase/app'
import auth from '@react-native-firebase/auth'

import * as types from './types'

const AuthContext = createContext<types.AuthContextProps>(
  {} as types.AuthContextProps
)

const AuthProvider = ({ children }: types.AuthProviderProps) => {
  const [user, setUser] = useState<types.User>()
  const [loading, setLoading] = useState(true)

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

      await auth().signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      )

      updateUserDataFromCurrentUserFirebase()
    } catch {
      throw new Error('Login ou senha inválidos')
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (data: types.SignUpInput) => {
    try {
      setLoading(true)

      const { user } = await auth().createUserWithEmailAndPassword(
        data.email,
        data.password
      )

      await user.updateProfile({
        displayName: data.name
      })
    } catch (err) {
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
      // await AsyncStorage.removeItem(STORAGE_USER_KEY)
      setUser(undefined)
    } catch (error) {
      throw new Error('Ocorreu um erro ao tentar fazer logout')
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true)

      await auth().sendPasswordResetEmail(email)
    } catch (error) {
      throw new Error('Ocorreu um erro ao tentar enviar o e-mail')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: types.UpdateProfileInput) => {
    try {
      setLoading(true)

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
