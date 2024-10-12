import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useTheme } from 'styled-components/native'

import { Text } from '@components/Text'

import * as S from './styles'

export function Disconnected() {
  const theme = useTheme()

  return (
    <S.Wrapper>
      <MaterialCommunityIcons
        name="lan-disconnect"
        size={90}
        color={theme.colors.gray_500}
      />

      <Text align="center" size={20} color="gray_300">
        Parece que você está sem internet, conecte-se para continuar.
      </Text>
    </S.Wrapper>
  )
}
