import { MaterialIcons } from '@expo/vector-icons'
import { useTheme } from 'styled-components/native'

import { Text } from '@components/Text'
import { Button } from '@components/Button'

import * as S from './styles'

type EmptyActions = {
  actionDescription?: string
  onPress?: () => void
}

type EmptyProps = {
  description: string
} & EmptyActions

export function Empty({ description, actionDescription, onPress }: EmptyProps) {
  const theme = useTheme()

  return (
    <S.Wrapper>
      <MaterialIcons
        name="filter-list-off"
        size={90}
        color={theme.colors.gray_500}
      />

      <Text align="center" size={20} color="gray_300">
        {description}
      </Text>

      {!!onPress && actionDescription && (
        <Button variant="ghost" onPress={onPress} testID="emptyButtonAction">
          <Text fontFamily="robotoBold" color="green_500" size={20}>
            {actionDescription}
          </Text>
        </Button>
      )}
    </S.Wrapper>
  )
}
