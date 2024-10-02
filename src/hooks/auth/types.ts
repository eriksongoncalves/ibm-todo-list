import { ReactNode } from 'react'

export type SignInCredentials = {
  email: string
  password: string
}

export type User = {
  id: string
  name: string
  email: string
  imageUri?: string
}

export type SignUpInput = Omit<User, 'id'> & {
  password: string
}

export type UpdateProfileInput = Omit<User, 'imageUri'> & {
  old_password: string
  new_password: string
  image?: FormData
}

export type AuthContextProps = {
  user: User | undefined
  loading: boolean
  signIn(credentials: SignInCredentials): Promise<void>
  signOut(): Promise<void>
  signUp(data: SignUpInput): Promise<void>
  forgotPassword: (email: string) => Promise<void>
  updateProfile: (data: UpdateProfileInput) => Promise<void>
}

export type AuthProviderProps = {
  children: ReactNode
}
