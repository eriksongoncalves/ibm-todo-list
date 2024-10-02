import { Platform } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

import { Home } from '@screens/Home'
import { Profile } from '@screens/Profile'
import { useTheme } from 'styled-components/native'

export type BottomTabParamListBase = {
  home_tab: undefined
  profile_tab: undefined
}

const { Navigator, Screen } = createBottomTabNavigator<BottomTabParamListBase>()

export function AppTabRoutes() {
  const theme = useTheme()

  return (
    <Navigator
      backBehavior="none"
      screenOptions={{
        tabBarActiveTintColor: theme.colors.green_500,
        tabBarInactiveTintColor: theme.colors.gray_200,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopWidth: 0,
          paddingVertical: Platform.OS === 'ios' ? 20 : 0,
          height: Platform.OS === 'ios' ? 88 : 60,
          backgroundColor: theme.colors.gray_600
        }
      }}
    >
      <Screen
        name="home_tab"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="home-outline"
              size={30}
              color={color}
            />
          )
        }}
      />

      <Screen
        name="profile_tab"
        component={Profile}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitle: 'Perfil',
          headerTitleStyle: {
            color: theme.colors.white,
            fontFamily: 'Roboto_700Bold',
            fontSize: 20
          },
          headerStyle: {
            height: 124,
            backgroundColor: theme.colors.gray_600,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0
          },
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-circle" size={24} color={color} />
          )
        }}
      />
    </Navigator>
  )
}
