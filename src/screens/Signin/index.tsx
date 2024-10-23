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
import { SignInFormData, signInFormResolver } from './validationSchema'

export function SignIn() {
  const navigation = useNavigation()
  const { signIn, loading } = useAuth()

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<SignInFormData>({
    resolver: signInFormResolver,
    mode: 'all',
    reValidateMode: 'onChange'
  })

  async function handleNavigateToSignUp() {
    await logEvent(EVENT_TYPE.ACTION, {
      screen: 'SignIn',
      elementName: 'Criar conta'
    })

    navigation.navigate('signup')
  }

  async function onSubmit(data: SignInFormData) {
    try {
      await logEvent(EVENT_TYPE.ACTION, {
        screen: 'SignIn',
        elementName: 'Acessar'
      })

      await signIn(data)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      Toast.show({
        visibilityTime: 2000,
        type: 'error',
        text1: 'Opss...',
        text2: error.message
      })
    }
  }

  useEffect(() => {
    logEvent(EVENT_TYPE.PAGE_VIEW, {
      screen: 'SignIn'
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
              Acesse sua conta
            </Text>

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
                  returnKeyLabel="Acessar"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  mb={16}
                />
              )}
            />

            <Button onPress={handleSubmit(onSubmit)} loading={loading}>
              <Text fontFamily="robotoBold" color="white">
                Acessar
              </Text>
            </Button>
          </S.FormWrapper>
        </S.ContentWrapper>

        <S.BottomWrapper>
          <Text fontFamily="robotoRegular" color="white" mb={12} align="center">
            Ainda não tem acesso?
          </Text>

          <Button
            variant="outline"
            onPress={handleNavigateToSignUp}
            disabled={loading}
          >
            <Text fontFamily="robotoBold" color="green_500">
              Criar conta
            </Text>
          </Button>
        </S.BottomWrapper>
      </S.Wrapper>
    </TouchableWithoutFeedback>
  )
}
