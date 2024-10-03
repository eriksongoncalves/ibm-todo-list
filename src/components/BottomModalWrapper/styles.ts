import styled from 'styled-components/native'
import { Button } from '@components/Button'

export const Wrapper = styled.View`
  padding: 16px;
`

export const Header = styled.View`
  margin-bottom: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const Content = styled.View``

export const CloseButton = styled(Button)`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  padding: 0;
`
