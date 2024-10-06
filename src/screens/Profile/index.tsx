import { useCallback } from 'react'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { useFocusEffect } from '@react-navigation/native'
import Toast from 'react-native-toast-message'

import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { Text } from '@components/Text'
import { useAuth } from '@hooks/auth'

import * as S from './styles'
import { profileFormDataResolver, ProfileFormData } from './validationSchema'

export function Profile() {
  const { user, updateProfile, loading } = useAuth()

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors }
  } = useForm<ProfileFormData>({
    resolver: profileFormDataResolver,
    mode: 'all',
    reValidateMode: 'onChange'
  })

  async function onSubmit(data: ProfileFormData) {
    try {
      await updateProfile({
        name: data.name,
        email: data.email,
        password: data.password
      })

      setValue('password', '')
      setValue('confirm_password', '')

      Toast.show({
        visibilityTime: 2000,
        type: 'success',
        text1: '\\o/',
        text2: 'Dados salvos com sucesso!'
      })
    } catch (error: any) {
      Toast.show({
        visibilityTime: 2000,
        type: 'error',
        text1: 'Opss...',
        text2: error.message
      })
    }
  }

  useFocusEffect(
    useCallback(() => {
      reset({
        name: user?.name,
        email: user?.email,
        password: '',
        confirm_password: ''
      })
    }, [user])
  )

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <S.Wrapper>
        <S.Content>
          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                keyboardType="ascii-capable"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
                mb={16}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
                mb={16}
              />
            )}
          />

          <Text fontFamily="robotoBold" color="white" size={18} mb={8} mt={22}>
            Alterar senha
          </Text>

          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <Input
                  placeholder="Senha (Opcional)"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.password?.message}
                  mb={16}
                />
              )
            }}
          />

          <Controller
            name="confirm_password"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Confirmar senha  (Opcional)"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.confirm_password?.message}
                mb={16}
              />
            )}
          />

          <Button onPress={handleSubmit(onSubmit)} loading={loading}>
            <Text fontFamily="robotoBold" color="white">
              Salvar
            </Text>
          </Button>
        </S.Content>
        <Toast />
      </S.Wrapper>
    </TouchableWithoutFeedback>
  )
}
