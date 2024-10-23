import { useMemo } from 'react'
import { Platform } from 'react-native'
import { useTheme } from 'styled-components/native'
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs'
import { FontAwesome5, FontAwesome6, MaterialIcons } from '@expo/vector-icons'

import { Profile } from '@screens/Profile'
import { MyLists } from '@screens/MyLists'
import { ListItem } from '@screens/ListItem'
import { useAuth } from '@hooks/auth'
import { Text } from '@components/Text'

export type BottomTabParamListBase = {
  my_lists_tab: undefined
  list_item: undefined
  profile_tab: undefined
  logout_tab: undefined
}

type ListItemsRouteParams = {
  name?: string
}

const { Navigator, Screen } = createBottomTabNavigator<BottomTabParamListBase>()

function LogoutComponent() {
  return <></>
}

export function AppTabRoutes() {
  const theme = useTheme()
  const { signOut } = useAuth()

  const tabWithHeaderOptions: BottomTabNavigationOptions = useMemo(
    () => ({
      headerShown: true,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: theme.colors.white,
        fontFamily: theme.fonts.family.roboto.bold,
        fontSize: 24
      },
      headerStyle: {
        height: 124,
        backgroundColor: theme.colors.gray_600,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0
      }
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

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
          height: Platform.OS === 'ios' ? 88 : 70,
          backgroundColor: theme.colors.gray_600
        }
      }}
    >
      <Screen
        name="my_lists_tab"
        component={MyLists}
        options={{
          ...tabWithHeaderOptions,
          headerTitle: 'Minhas Listas',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="table-list" size={22} color={color} />
          )
        }}
      />

      <Screen
        name="profile_tab"
        component={Profile}
        options={{
          ...tabWithHeaderOptions,
          headerTitle: 'Meu Perfil',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-circle" size={24} color={color} />
          )
        }}
      />

      <Screen
        name="logout_tab"
        component={LogoutComponent}
        options={{
          tabBarIcon: () => (
            <MaterialIcons
              name="logout"
              size={24}
              color={theme.colors.gray_200}
            />
          )
        }}
        listeners={() => ({
          tabPress: e => {
            e.preventDefault()
            signOut()
          }
        })}
      />

      <Screen
        name="list_item"
        component={ListItem}
        options={({ route }) => {
          const name = route?.params
            ? (route.params! as ListItemsRouteParams)?.name
            : ''

          return {
            ...tabWithHeaderOptions,
            headerTitle: () => (
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                color="white"
                fontFamily="robotoBold"
                size={22}
              >
                {name}
              </Text>
            ),
            tabBarButton: () => null
          }
        }}
      />
    </Navigator>
  )
}
