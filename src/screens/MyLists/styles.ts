import styled, { css } from 'styled-components/native'

import { Button } from '@components/Button'

export const Wrapper = styled.View`
  ${({ theme }) => css`
    flex: 1;
    background-color: ${theme.colors.gray_700};
  `}
`

export const ListWrapper = styled.View`
  margin-top: 32px;
  padding-left: 16px;
  padding-right: 16px;
`

export const Item = styled.View`
  ${({ theme }) => css`
    background-color: ${theme.colors.gray_600};
    margin-bottom: 16px;
    padding: 16px;
    border-radius: 8px;
  `}
`

export const TitleWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
`

export const HeaderIconButton = styled(Button)`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin-right: 16px;
`

export const EmptyWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 16px;
`

export const MenuItem = styled(Button)`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0;
  gap: 16px;
`
