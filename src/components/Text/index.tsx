import { TextProps as TextPropsBase } from 'react-native'

import {
  ThemeColors,
  ThemeFontFamilies,
  ThemeFontSizes,
  Spacing
} from '@shared/theme'
import * as S from './styles'

type TextProps = {
  size?: ThemeFontSizes
  fontFamily?: ThemeFontFamilies
  color?: ThemeColors
  align?: 'center' | 'left' | 'right' | 'justify'
  trasnform?: 'none' | 'uppercase' | 'lowercase'
  mt?: Spacing
  mb?: Spacing
} & TextPropsBase

export function Text({
  size = 16,
  fontFamily = 'robotoRegular',
  color = 'gray_100',
  align = 'left',
  trasnform = 'none',
  children,
  ...rest
}: TextProps) {
  return (
    <S.Wrapper
      size={size}
      fontFamily={fontFamily}
      color={color}
      align={align}
      trasnform={trasnform}
      {...rest}
    >
      {children}
    </S.Wrapper>
  )
}
