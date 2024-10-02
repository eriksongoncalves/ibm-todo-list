import { NavigationContainer } from '@react-navigation/native'

import { useAuth } from '@hooks/auth'

import { AppTabRoutes } from './app.tab.routes'
import { AuthStackRoutes } from './auth.stack.routes'

export function Routes() {
  const { user } = useAuth()

  return (
    <NavigationContainer>
      {user?.id ? <AppTabRoutes /> : <AuthStackRoutes />}
    </NavigationContainer>
  )
}
