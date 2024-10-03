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
  ml?: Spacing
}

const modifiers = {
  fontFamily: (fontFamily: ThemeFontFamilies) => mapFontFamilies[fontFamily],
  lineHeight: (fontSize: ThemeFontSizes, theme: DefaultTheme) =>
    theme.fonts.lineHeight(fontSize)
}

export const Wrapper = styled.Text<WrapperProps>`
  ${({ theme, size, fontFamily, color, align, trasnform, mt, mb, ml }) => css`
    font-size: ${theme.fonts.size[size]};
    font-family: ${modifiers.fontFamily(fontFamily)};
    color: ${theme.colors[color]};
    line-height: ${modifiers.lineHeight(size, theme)};
    text-align: ${align};
    text-transform: ${trasnform};
    margin-top: ${mt ? `${mt}px` : 'initial'};
    margin-bottom: ${mb ? `${mb}px` : 'initial'};
    margin-left: ${ml ? `${ml}px` : 'initial'};
  `}
`
