import styled, { css } from 'styled-components/native'
import { Bar } from 'react-native-progress'

import { Spacing } from '@shared/theme'

type ContainerProps = {
  mt?: Spacing
  mb?: Spacing
}

export const Wrapper = styled.View<ContainerProps>`
  ${({ theme, mt, mb }) => css`
    width: 100%;
    flex-direction: row;
    gap: 16px;
    align-items: center;
    justify-content: flex-start;
    margin-top: ${mt ? `${mt}px` : 'auto'};
    margin-bottom: ${mb ? `${mb}px` : 'auto'};
  `}
`

export const Progress = styled(Bar)`
  flex: 1;
`
