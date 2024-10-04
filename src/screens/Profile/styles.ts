import styled, { css } from 'styled-components/native'
import { getBottomSpace } from 'react-native-iphone-x-helper'

export const Wrapper = styled.View`
  ${({ theme }) => css`
    flex: 1;
    width: 100%;
    background-color: ${theme.colors.gray_700};
    padding-bottom: ${getBottomSpace()}px;
  `}
`

export const Content = styled.View`
  flex: 1;
  padding: 0 32px;
  margin-top: 40px;
`
