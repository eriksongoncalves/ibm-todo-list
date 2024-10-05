import styled, { css, DefaultTheme } from 'styled-components/native'
import { TextInput as Input } from 'react-native'

import { Spacing } from '@shared/theme'

const variants = {
  error: (theme: DefaultTheme) => css`
    border: 1px solid ${theme.colors.red_600};
  `,
  active: (theme: DefaultTheme) => css`
    border: 1px solid ${theme.colors.green_700};
  `,
  disabled: (theme: DefaultTheme) => css`
    color: ${theme.colors.gray_500};
  `
}

type TextInputProps = {
  isActive: boolean
  isDisabled: boolean
  hasError: boolean
  mt?: Spacing
  mb?: Spacing
}

export const TextInput = styled(Input)<TextInputProps>`
  ${({ theme, isActive, hasError, isDisabled, mt, mb }) => css`
    width: 100%;
    border-radius: 8px;
    border: 1px solid ${theme.colors.gray_600};
    background-color: ${theme.colors.gray_600};
    padding: 16px;
    font-family: ${theme.fonts.family.roboto.regular};
    font-size: ${theme.fonts.size[16]};
    color: ${theme.colors.gray_200};

    ${mt &&
    css`
      margin-top: ${mt}px;
    `};
    ${mb &&
    css`
      margin-bottom: ${mb}px;
    `};

    ${hasError && variants.error(theme)};
    ${isActive && variants.active(theme)};
    ${isDisabled && variants.disabled(theme)};
  `}
`
