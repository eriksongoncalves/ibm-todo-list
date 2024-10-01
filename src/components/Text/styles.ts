import styled, { css, DefaultTheme } from 'styled-components/native'

import {
  ThemeColors,
  ThemeFontFamilies,
  ThemeFontSizes,
  mapFontFamilies,
  Spacing
} from '@shared/theme'

type WrapperProps = {
  size: ThemeFontSizes
  fontFamily: ThemeFontFamilies
  color: ThemeColors
  align: 'center' | 'left' | 'right' | 'justify'
  trasnform?: 'none' | 'uppercase' | 'lowercase'
  mt?: Spacing
  mb?: Spacing
}

const modifiers = {
  fontFamily: (fontFamily: ThemeFontFamilies) => mapFontFamilies[fontFamily],
  lineHeight: (fontSize: ThemeFontSizes, theme: DefaultTheme) =>
    theme.fonts.lineHeight(fontSize)
}

export const Wrapper = styled.Text<WrapperProps>`
  ${({ theme, size, fontFamily, color, align, trasnform, mt, mb }) => css`
    font-size: ${theme.fonts.size[size]};
    font-family: ${modifiers.fontFamily(fontFamily)};
    color: ${theme.colors[color]};
    line-height: ${modifiers.lineHeight(size, theme)};
    text-align: ${align};
    text-transform: ${trasnform};
    margin-top: ${mt ? `${mt}px` : 'auto'};
    margin-bottom: ${mb ? `${mb}px` : 'auto'};
  `}
`
