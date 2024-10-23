import analytics from '@react-native-firebase/analytics'
import auth from '@react-native-firebase/auth'
import { Platform } from 'react-native'

export enum EVENT_TYPE {
  PAGE_VIEW = 'TELA',
  ACTION = 'ACAO'
}

type PARAMS = {
  [key: string]: string | number | boolean
}

export async function logEvent(event: EVENT_TYPE, params: PARAMS) {
  const currentUser = auth().currentUser

  const firebaseAnalytics = analytics()

  if (currentUser) {
    firebaseAnalytics.setUserId(currentUser.uid)
    firebaseAnalytics.setUserProperties({
      name: currentUser.displayName!,
      email: currentUser.email!
    })
  }

  params = {
    platform: Platform.OS,
    ...params
  }

  // eslint-disable-next-line no-console
  console.log(`>>> FIREBASE ${event} `, params)

  return await firebaseAnalytics.logEvent(event, params)
}
