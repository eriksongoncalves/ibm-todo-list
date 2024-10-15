import { TouchableOpacityProps, ActivityIndicator } from 'react-native'
import { useTheme } from 'styled-components/native'

import * as S from './styles'
import { Spacing } from '@shared/theme'

export type ButtonVariant = 'default' | 'outline' | 'ghost'

type ButtonProps = {
  variant?: ButtonVariant
  loading?: boolean
  disabled?: boolean
  mt?: Spacing
  mb?: Spacing
  ml?: Spacing
} & TouchableOpacityProps

export function Button({
  children,
  variant = 'default',
  loading,
  disabled,
  mb,
  mt,
  ml,
  ...rest
}: ButtonProps) {
  const theme = useTheme()

  return (
    <S.ButtonWrapper
      activeOpacity={0.7}
      variant={variant}
      disabled={disabled || loading}
      mb={mb}
      mt={mt}
      ml={ml}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.white} testID="buttonLoading" />
      ) : (
        children
      )}
    </S.ButtonWrapper>
  )
}
