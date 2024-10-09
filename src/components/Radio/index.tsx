import Ionicons from '@expo/vector-icons/Ionicons'
import { TouchableWithoutFeedback } from 'react-native'
import { useTheme } from 'styled-components/native'

import { Text } from '../Text'
import * as S from './styles'

type RadioProps = {
  label?: string
  isChecked?: boolean
  onPress?: () => void
}

export function Radio({ label = '', isChecked = false, onPress }: RadioProps) {
  const theme = useTheme()

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <S.Wrapper>
        <Ionicons
          name={`radio-button-${isChecked ? 'on' : 'off'}`}
          size={24}
          color={theme.colors.green_500}
        />

        {label && <Text color="white">{label}</Text>}
      </S.Wrapper>
    </TouchableWithoutFeedback>
  )
}
