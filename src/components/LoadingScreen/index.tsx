import { ActivityIndicator } from 'react-native'
import { useTheme } from 'styled-components'

import * as S from './styles'

export function LoadingScreen() {
  const theme = useTheme()

  return (
    <S.Wrapper>
      <ActivityIndicator color={theme.colors.green_500} size="large" />
    </S.Wrapper>
  )
}
