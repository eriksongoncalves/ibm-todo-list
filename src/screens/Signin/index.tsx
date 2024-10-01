import { Alert, Image } from 'react-native'
import { useForm, Controller } from 'react-hook-form'

import appLogoIcon from '@assets/images/app-logo-icon.png'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { Text } from '@components/Text'

import * as S from './styles'
import { SignInFormData, signInFormResolver } from './validationSchema'

export function SignIn() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<SignInFormData>({
    resolver: signInFormResolver,
    mode: 'all',
    reValidateMode: 'onChange'
  })

  async function onSubmit(data: any) {
    try {
      console.log('>>> data', data)
    } catch {
      Alert.alert('Login ou senha inválidos')
    }
  }

  return (
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
            Acesse sua conta
          </Text>

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
                returnKeyLabel="Acessar"
                onSubmitEditing={handleSubmit(onSubmit)}
                mb={16}
              />
            )}
          />

          <Button onPress={handleSubmit(onSubmit)} disabled={false}>
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

        <Button variant="outline" onPress={() => {}} disabled={false}>
          <Text fontFamily="robotoBold" color="green_500">
            Criar conta
          </Text>
        </Button>
      </S.BottomWrapper>
    </S.Wrapper>
    // </TouchableWithoutFeedback>
  )
}
