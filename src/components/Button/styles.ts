import styled, { css, DefaultTheme } from 'styled-components/native'
import { TouchableOpacity } from 'react-native'

import { ButtonVariant } from '.'
import { Spacing } from '@shared/theme'

const variants = {
  default: (theme: DefaultTheme) => css`
    border: 1px solid ${theme.colors.green_700};
    background-color: ${theme.colors.green_700};
  `,
  outline: (theme: DefaultTheme) => css`
    border: 1px solid ${theme.colors.green_500};
  `,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ghost: (theme: DefaultTheme) => css`
    width: auto;
    padding: 0;
  `
}

type ContainerProps = {
  variant: ButtonVariant
  mt?: Spacing
  mb?: Spacing
  ml?: Spacing
}

export const ButtonWrapper = styled(TouchableOpacity)<ContainerProps>`
  ${({ theme, variant, mt, mb, ml }) => css`
    width: 100%;
    align-items: center;
    border-radius: 8px;
    padding: 16px;
    ${variants[variant](theme)}
    ${mt &&
    css`
      margin-top: ${mt}px;
    `};
    ${mb &&
    css`
      margin-bottom: ${mb}px;
    `};
    ${ml &&
    css`
      margin-left: ${ml}px;
    `};
  `}
`
