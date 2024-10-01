import {
  View,
  Text,
  Alert,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'
import { useForm } from 'react-hook-form'

import appLogoIcon from '@assets/images/app-logo-icon.png'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { SignInFormData, signInFormResolver } from './validationSchema'

export function SignIn() {
  const {
    register,
    handleSubmit,
    setValue,
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
    <View className="flex-1 bg-gray-600">
      <View className={`w-full flex-1 rounded-b-3xl bg-gray-700 pl-8 pr-8`}>
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          accessible={false}
          className="flex-1"
        >
          <SafeAreaView>
            <View className="mt-12 items-center">
              <Image
                source={appLogoIcon}
                style={{ width: 80, height: 80 }}
                resizeMode="contain"
              />
              <Text className="mt-5 font-robotoBold text-xl text-white">
                TODO-LIST
              </Text>
            </View>

            <View className="mt-20 w-full">
              <Text className="mb-4 text-center font-robotoBold text-lg text-white">
                Acesse sua conta
              </Text>

              <Input
                {...register('email')}
                placeholder="E-mail"
                keyboardType="email-address"
                className="mb-4"
                onChangeText={value => setValue('email', value)}
                errorMessage={errors.email?.message}
              />

              <Input
                {...register('password')}
                placeholder="Senha"
                className="mb-4"
                secureTextEntry
                onChangeText={value => setValue('password', value)}
                errorMessage={errors.password?.message}
                returnKeyLabel="Acessar"
                onSubmitEditing={handleSubmit(onSubmit)}
              />

              <Button onPress={handleSubmit(onSubmit)} disabled={false}>
                <Text className="font-robotoBold text-base text-white">
                  Acessar
                </Text>
              </Button>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </View>

      <View className="mt-16 w-full pb-20 pl-8 pr-8">
        <Text className="mb-3 text-center font-robotoRegular text-base text-white">
          Ainda não tem acesso?
        </Text>

        <Button
          variant="outline"
          onPress={() => {}}
          className="mb-4"
          disabled={false}
        >
          <Text className="font-robotoBold text-base text-green-500">
            Criar conta
          </Text>
        </Button>
      </View>
    </View>
  )
}
