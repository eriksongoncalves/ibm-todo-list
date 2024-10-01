import { TouchableOpacityProps } from 'react-native'

import * as S from './styles'
import { Spacing } from '@shared/theme'

export type ButtonVariant = 'default' | 'outline' | 'ghost'

type ButtonProps = {
  variant?: ButtonVariant
  mt?: Spacing
  mb?: Spacing
} & TouchableOpacityProps

export function Button({
  children,
  variant = 'default',
  mb,
  mt,
  ...rest
}: ButtonProps) {
  return (
    <S.ButtonWrapper
      activeOpacity={0.7}
      variant={variant}
      mb={mb}
      mt={mt}
      {...rest}
    >
      {children}
    </S.ButtonWrapper>
  )
}
