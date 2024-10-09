import styled, { css } from 'styled-components/native'

import { Button } from '@components/Button'

export const Wrapper = styled.View`
  ${({ theme }) => css`
    flex: 1;
    background-color: ${theme.colors.gray_700};
  `}
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
  align-items: center;
  gap: 8px;
`

export const StatusWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`

export const StatusButton = styled(Button)<{ isActive?: boolean }>`
  ${({ theme, isActive }) => css`
    background-color: ${theme.colors.gray_600};
    width: auto;
    border: 0;
    padding-left: 10px;
    padding-right: 10px;

    ${isActive &&
    css`
      background-color: ${theme.colors.green_500};
    `};
  `}
`
