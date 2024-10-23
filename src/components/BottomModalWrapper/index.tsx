import { forwardRef } from 'react'
import {
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetScrollView
} from '@gorhom/bottom-sheet'
import { useTheme } from 'styled-components/native'
import { AntDesign } from '@expo/vector-icons'

import { Text } from '@components/Text'

import * as S from './styles'

type BottomModalProps = {
  title?: string
  children: React.ReactNode
  onClose: () => void
  forceEnableDismiss?: boolean | null
} & BottomSheetModalProps

export const BottomModalWrapper = forwardRef<
  BottomSheetModal,
  BottomModalProps
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(({ title = '', children, onClose, forceEnableDismiss, ...rest }, ref) => {
  const theme = useTheme()

  return (
    <BottomSheetModal
      ref={ref}
      enablePanDownToClose={false}
      enableContentPanningGesture={false}
      containerStyle={{ backgroundColor: 'rgba(0,0,0,.7)' }}
      backgroundStyle={{ backgroundColor: theme.colors.gray_400 }}
      // enableDismissOnClose={
      //   forceEnableDismiss !== null ? forceEnableDismiss : false
      // }
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      {...rest}
    >
      <BottomSheetScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: theme.colors.gray_400,
          flexGrow: 1
        }}
      >
        <S.Wrapper>
          <S.Header>
            <Text color="gray_100" size={22} fontFamily="robotoBold">
              {title}
            </Text>

            <S.CloseButton onPress={onClose} testID="bottomSheetModalClose">
              <AntDesign name="close" size={16} color={theme.colors.white} />
            </S.CloseButton>
          </S.Header>

          <S.Content>{children}</S.Content>
        </S.Wrapper>
      </BottomSheetScrollView>
    </BottomSheetModal>
  )
})
