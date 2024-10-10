import styled, { css, DefaultTheme } from 'styled-components/native'
import { TextInput as Input, Platform, TouchableOpacity } from 'react-native'

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
  // numberOfLines?: number
}

export const Wrapper = styled.View`
  position: relative;
`

export const TextInput = styled(Input)<TextInputProps>`
  ${({ theme, isActive, hasError, isDisabled, mt, mb, numberOfLines }) => css`
    width: 100%;
    border-radius: 8px;
    border: 1px solid ${theme.colors.gray_600};
    background-color: ${theme.colors.gray_600};
    padding: 16px;
    font-family: ${theme.fonts.family.roboto.regular};
    font-size: ${theme.fonts.size[16]};
    color: ${theme.colors.gray_200};
    vertical-align: top;

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
    ${Platform.OS === 'ios' &&
    numberOfLines &&
    css`
      height: ${numberOfLines * 18}px;
    `}
  `}
`

export const SuggestionList = styled.ScrollView`
  ${({ theme }) => css`
    position: absolute;
    top: 62px;
    width: 100%;
    background-color: ${theme.colors.gray_500};
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    border: 1px solid ${theme.colors.gray_500};
    max-height: 150px;
    padding: 12px 16px;
    z-index: 1;
  `}
`

export const SuggestionListItem = styled(TouchableOpacity)`
  ${({ theme }) => css`
    width: 100%;
    border-bottom: 2px solid ${theme.colors.white};
    padding-top: 12px;
    padding-bottom: 12px;
  `}
`
