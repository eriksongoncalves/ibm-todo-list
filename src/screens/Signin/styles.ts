import styled, { css } from 'styled-components/native'
import {
  getStatusBarHeight,
  getBottomSpace
} from 'react-native-iphone-x-helper'

export const Wrapper = styled.ScrollView`
  ${({ theme }) => css`
    flex: 1;
    width: 100%;
    background-color: ${theme.colors.gray_600};
    padding-bottom: ${getBottomSpace()}px;
  `}
`

export const ContentWrapper = styled.View`
  ${({ theme }) => css`
    width: 100%;
    border-bottom-left-radius: 32px;
    border-bottom-right-radius: 32px;
    background-color: ${theme.colors.gray_700};
    padding-top: ${getStatusBarHeight() + 30}px;
    padding-left: 32px;
    padding-right: 32px;
    padding-bottom: 32px;
  `}
`

export const LogoWrapper = styled.View`
  margin-top: 30px;
  align-items: center;
`

export const FormWrapper = styled.View`
  width: 100%;
  padding-bottom: 32px;
  margin-top: 50px;
`

export const BottomWrapper = styled.View`
  width: 100%;
  padding-left: 32px;
  padding-right: 32px;
  padding-top: 50px;
`
