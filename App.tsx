import { useCallback } from 'react'
import { StatusBar } from 'expo-status-bar'
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold
} from '@expo-google-fonts/roboto'
import * as SplashScreen from 'expo-splash-screen'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ThemeProvider } from 'styled-components'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import Toast from 'react-native-toast-message'

import { Routes } from '@src/routes'
import { theme } from '@shared/theme'
import { AuthProvider } from '@hooks/auth'

SplashScreen.preventAutoHideAsync()

export default function App() {
  const [fontsLoaded, error] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  })

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded && !error) {
    return null
  }

  return (
    <GestureHandlerRootView onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <StatusBar style="light" backgroundColor="transparent" translucent />
        <AuthProvider>
          <BottomSheetModalProvider>
            <Routes />
          </BottomSheetModalProvider>
        </AuthProvider>
      </ThemeProvider>

      <Toast />
    </GestureHandlerRootView>
  )
}
