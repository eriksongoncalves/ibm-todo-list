import { Alert, Image, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { useNavigation } from '@react-navigation/native'

import appLogoIcon from '@assets/images/app-logo-icon.png'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { Text } from '@components/Text'
import { useAuth } from '@hooks/auth'

import * as S from './styles'
import { SignUpFormData, signUpFormResolver } from './validationSchema'

export function SignUp() {
  const navigation = useNavigation()
  const { signUp, loading } = useAuth()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<SignUpFormData>({
    resolver: signUpFormResolver,
    mode: 'all',
    reValidateMode: 'onChange'
  })

  function handleNavigateToSignIn() {
    navigation.goBack()
  }

  async function onSubmit(data: any) {
    try {
      await signUp(data)
    } catch {
      Alert.alert('Ocorreu um erro ao salvar os dados')
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <S.Wrapper>
        <S.ContentWrapper>
          <S.LogoWrapper>
            <Image
              source={appLogoIcon}
              style={{ width: 80, height: 80 }}
              resizeMode="contain"
            />
            <Text fontFamily="robotoBold" size={20} color="white" mt={16}>
              TODO-LIST
            </Text>
          </S.LogoWrapper>

          <S.FormWrapper>
            <Text
              mb={16}
              align="center"
              fontFamily="robotoBold"
              size={18}
              color="white"
            >
              Crie sua conta
            </Text>

            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  {...register('name')}
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
                  {...register('email')}
                  placeholder="E-mail"
                  keyboardType="email-address"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.email?.message}
                  mb={16}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  {...register('password')}
                  placeholder="Senha"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.password?.message}
                  mb={16}
                />
              )}
            />

            <Controller
              name="confirm_password"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  {...register('confirm_password')}
                  placeholder="Confirmar senha"
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
                Salvar e acessar
              </Text>
            </Button>
          </S.FormWrapper>
        </S.ContentWrapper>

        <S.BottomWrapper>
          <Button
            variant="outline"
            onPress={handleNavigateToSignIn}
            disabled={loading}
          >
            <Text fontFamily="robotoBold" color="green_500">
              Voltar para o login
            </Text>
          </Button>
        </S.BottomWrapper>
      </S.Wrapper>
    </TouchableWithoutFeedback>
  )
}