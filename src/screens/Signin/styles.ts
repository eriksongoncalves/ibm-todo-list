import styled, { css } from 'styled-components/native'
import {
  getStatusBarHeight,
  getBottomSpace
} from 'react-native-iphone-x-helper'

export const Wrapper = styled.View`
  ${({ theme }) => css`
    flex: 1;
    width: 100%;
    background-color: ${theme.colors.gray_600};
    padding-top: ${getStatusBarHeight()}px;
    padding-bottom: ${getBottomSpace()}px;
  `}
`

export const ContentWrapper = styled.View`
  ${({ theme }) => css`
    flex: 1;
    width: 100%;
    border-bottom-left-radius: 32px;
    border-bottom-right-radius: 32px;
    background-color: ${theme.colors.gray_700};
    padding-top: 0;
    padding-bottom: 32px;
    padding-left: 32px;
    padding-right: 32px;
  `}
`

export const LogoWrapper = styled.View`
  margin-top: 50px;
  align-items: center;
`

export const FormWrapper = styled.View`
  width: 100%;
  padding: 32px;
  margin-top: 20px;
`

export const BottomWrapper = styled.View`
  width: 100%;
  padding: 32px;
  padding-top: 80px;
  padding-bottom: 80px;
`
