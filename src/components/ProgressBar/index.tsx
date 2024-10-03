import { useMemo } from 'react'
import { BarPropTypes } from 'react-native-progress'
import { useTheme } from 'styled-components/native'

import * as S from './styles'
import { Spacing } from '@shared/theme'
import { Text } from '../Text'

type ButtonProps = {
  itemsCount?: number
  itemsTotal?: number
  showItemsText?: boolean
  mt?: Spacing
  mb?: Spacing
} & BarPropTypes

export function ProgressBar({
  itemsCount = 0,
  itemsTotal = 0,
  showItemsText = false,
  mb,
  mt,
  ...rest
}: ButtonProps) {
  const theme = useTheme()

  const progress = useMemo(() => {
    if (itemsTotal <= 0) return 0

    return itemsCount / itemsTotal
  }, [itemsCount, itemsTotal])

  return (
    <S.Wrapper mb={mb} mt={mt}>
      <S.Progress
        progress={progress}
        width={null}
        height={12}
        borderRadius={8}
        unfilledColor={theme.colors.gray_400}
        borderWidth={0}
        color={theme.colors.green_500}
        {...rest}
      />

      {showItemsText && (
        <Text fontFamily="robotoBold" size={18}>
          {itemsCount}/{itemsTotal}
        </Text>
      )}
    </S.Wrapper>
  )
}
