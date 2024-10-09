import { NavigationContainer } from '@react-navigation/native'

import { useAuth } from '@hooks/auth'

import { AppTabRoutes } from './app.tab.routes'
import { AuthStackRoutes } from './auth.stack.routes'
import { LoadingScreen } from '@src/components/LoadingScreen'

export function Routes() {
  const { user, isInitialLoading } = useAuth()

  return (
    <NavigationContainer>
      {isInitialLoading ? (
        <LoadingScreen />
      ) : user?.id ? (
        <AppTabRoutes />
      ) : (
        <AuthStackRoutes />
      )}
    </NavigationContainer>
  )
}
