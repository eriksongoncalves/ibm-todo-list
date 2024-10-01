import { useState } from 'react'
import { TextInput, TextInputProps } from 'react-native'
import { useTheme } from 'styled-components/native'

import * as S from './styles'
import { Spacing } from '@shared/theme'
import { Text } from '@components/Text'

type InputProps = {
  style?: string
  disabled?: boolean
  errorMessage?: string
  mt?: Spacing
  mb?: Spacing
} & TextInputProps

export function Input({
  errorMessage,
  disabled,
  onBlur,
  mt,
  mb,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const theme = useTheme()

  function handleInputFocus() {
    setIsFocused(true)
  }

  function handleInputBlur() {
    setIsFocused(false)
  }

  return (
    <>
      <S.TextInput
        isActive={isFocused && !errorMessage}
        isDisabled={!!disabled}
        hasError={!!errorMessage}
        autoCorrect={false}
        autoCapitalize="none"
        editable={!disabled}
        onFocus={handleInputFocus}
        onBlur={e => {
          !!onBlur && onBlur(e)
          handleInputBlur()
        }}
        placeholderTextColor={theme.colors.gray_300}
        mt={mt}
        mb={!errorMessage ? mb : undefined}
        {...rest}
      />

      {!!errorMessage && (
        <Text
          mb={mb}
          mt={4}
          fontFamily="robotoRegular"
          size={14}
          color="red_600"
        >
          {errorMessage}
        </Text>
      )}
    </>
  )
}
