export const theme = {
  fonts: {
    family: {
      roboto: {
        regular: 'Roboto_400Regular',
        bold: 'Roboto_700Bold'
      }
    },
    size: {
      10: '10px',
      12: '12px',
      14: '14px',
      16: '16px',
      18: '18px',
      20: '20px',
      22: '22px',
      24: '24px',
      26: '26px',
      28: '28px',
      30: '30px',
      32: '32px'
    },
    lineHeight: (fontSize: number) => `${(fontSize * 1.3).toFixed(2)}px`
  },
  colors: {
    gray_100: '#e1e1e6',
    gray_200: '#c4c4cc',
    gray_300: '#7c7c8a',
    gray_400: '#323238',
    gray_500: '#29292e',
    gray_600: '#202024',
    gray_700: '#121214',
    green_500: '#00b37e',
    green_700: '#00875f',
    red_600: '#F75A68',
    transparent: 'transparent',
    white: '#ffffff',
    black: '#000000'
  }
} as const

export type Spacing = 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20 | 22 | 24

enum FontFamilies {
  'robotoRegular' = 'robotoRegular',
  'robotoBold' = 'robotoBold'
}

export type ThemeFontSizes = keyof typeof theme.fonts.size
export type ThemeColors = keyof typeof theme.colors
export type ThemeFontFamilies = keyof typeof FontFamilies

export const mapFontFamilies = {
  [FontFamilies.robotoRegular]: theme.fonts.family.roboto.regular,
  [FontFamilies.robotoBold]: theme.fonts.family.roboto.bold
}
