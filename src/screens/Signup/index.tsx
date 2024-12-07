import { useEffect } from 'react'
import { Image, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'

import appLogoIcon from '@assets/images/app-logo-icon.png'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { Text } from '@components/Text'
import { useAuth } from '@hooks/auth'
import { logEvent, EVENT_TYPE } from '@utils/analitycs'

import * as S from './styles'
import { SignUpFormData, signUpFormResolver } from './validationSchema'

export function SignUp() {
  const navigation = useNavigation()
  const { signUp, loading } = useAuth()

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<SignUpFormData>({
    resolver: signUpFormResolver,
    mode: 'all',
    reValidateMode: 'onChange'
  })

  async function handleNavigateToSignIn() {
    await logEvent(EVENT_TYPE.ACTION, {
      screen: 'SignUp',
      elementName: 'Voltar para o login'
    })

    navigation.goBack()
  }

  async function onSubmit(data: SignUpFormData) {
    try {
      await logEvent(EVENT_TYPE.ACTION, {
        screen: 'SignUp',
        elementName: 'Salvar'
      })

      await signUp(data)

      Toast.show({
        visibilityTime: 2000,
        type: 'success',
        text1: '\\o/',
        text2: 'Conta criada com sucesso!'
      })

      handleNavigateToSignIn()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      Toast.show({
        visibilityTime: 2000,
        type: 'error',
        text1: 'Opss...',
        text2: err?.message
      })
    }
  }

  useEffect(() => {
    logEvent(EVENT_TYPE.PAGE_VIEW, {
      screen: 'SignUp'
    })
  }, [])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <S.Wrapper bounces={false}>
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

            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
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
                  placeholder="Confirmar senha"
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
