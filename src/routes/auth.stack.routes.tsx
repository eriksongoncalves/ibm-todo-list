import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { SignIn } from '@screens/Signin'
import { SignUp } from '@screens/Signup'

const { Navigator, Screen } = createNativeStackNavigator()

export function AuthStackRoutes() {
  return (
    <Navigator>
      <Screen
        name="signin"
        component={SignIn}
        options={{ headerShown: false }}
      />
      <Screen
        name="signup"
        component={SignUp}
        options={{ headerShown: false }}
      />
    </Navigator>
  )
}
