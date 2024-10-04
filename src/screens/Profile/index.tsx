import { useCallback } from 'react'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { useFocusEffect } from '@react-navigation/native'

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
    formState: { errors }
  } = useForm<ProfileFormData>({
    resolver: profileFormDataResolver,
    mode: 'all',
    reValidateMode: 'onChange'
  })

  function onSubmit(data: ProfileFormData) {
    console.log('>>> DATA', data)
  }

  useFocusEffect(
    useCallback(() => {
      reset({
        name: user?.name,
        email: user?.email,
        password: '',
        confirm_password: ''
      })
    }, [])
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

          <Button onPress={handleSubmit(onSubmit)} disabled={loading}>
            <Text fontFamily="robotoBold" color="white">
              Salvar
            </Text>
          </Button>
        </S.Content>
      </S.Wrapper>
    </TouchableWithoutFeedback>
  )
}
