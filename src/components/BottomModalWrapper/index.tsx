import { forwardRef, useEffect, useState } from 'react'
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
  hasForm?: boolean
  title?: string
  children: React.ReactNode
  onClose: () => void
} & BottomSheetModalProps

export const BottomModalWrapper = forwardRef<
  BottomSheetModal,
  BottomModalProps
>(({ hasForm = false, title = '', children, onClose, ...rest }, ref) => {
  const theme = useTheme()
  const [enableDismiss, setEnableDismiss] = useState(!hasForm)

  function handleClose() {
    setEnableDismiss(true)
    onClose()
  }

  useEffect(() => {
    if (hasForm && enableDismiss) {
      setTimeout(() => {
        setEnableDismiss(false)
      }, 500)
    }
  }, [hasForm, enableDismiss])

  return (
    <BottomSheetModal
      ref={ref}
      containerStyle={{ backgroundColor: 'rgba(0,0,0,.7)' }}
      backgroundStyle={{ backgroundColor: theme.colors.gray_400 }}
      enableDismissOnClose={enableDismiss}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      onDismiss={() => {
        hasForm && setEnableDismiss(false)
      }}
      {...rest}
    >
      <BottomSheetScrollView
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

            <S.CloseButton onPress={handleClose}>
              <AntDesign name="close" size={16} color={theme.colors.white} />
            </S.CloseButton>
          </S.Header>

          <S.Content>{children}</S.Content>
        </S.Wrapper>
      </BottomSheetScrollView>
    </BottomSheetModal>
  )
})
