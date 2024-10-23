import { useState, forwardRef } from 'react'
import { TextInput, TextInputProps, Keyboard } from 'react-native'
import { useTheme } from 'styled-components/native'

import * as S from './styles'
import { Spacing } from '@shared/theme'
import { Text } from '@components/Text'

export type SuggestionsList = {
  item: string
}

type InputProps = {
  style?: string
  disabled?: boolean
  errorMessage?: string
  mt?: Spacing
  mb?: Spacing
  suggestions?: SuggestionsList[]
  onSuggestionPress?: (item: string) => void
} & TextInputProps

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      errorMessage,
      disabled,
      onBlur,
      mt,
      mb,
      suggestions,
      onSuggestionPress,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const theme = useTheme()

    function handleInputFocus() {
      setIsFocused(true)
    }

    function handleInputBlur() {
      setIsFocused(false)
    }

    return (
      <S.Wrapper>
        <S.TextInput
          ref={ref}
          isActive={isFocused && !errorMessage}
          isDisabled={!!disabled}
          hasError={!!errorMessage}
          autoCorrect={false}
          autoCapitalize="none"
          autoComplete="off"
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
          testID="myInput"
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

        {suggestions && suggestions?.length > 0 && (
          <S.SuggestionList
            scrollEnabled
            nestedScrollEnabled
            onScrollBeginDrag={Keyboard.dismiss}
            showsVerticalScrollIndicator
            contentContainerStyle={{
              paddingBottom: 30
            }}
          >
            {suggestions.map(({ item }) => (
              <S.SuggestionListItem
                key={item}
                onPress={() => {
                  !!onSuggestionPress && onSuggestionPress(item)
                }}
              >
                <Text color="white">{item}</Text>
              </S.SuggestionListItem>
            ))}
          </S.SuggestionList>
        )}
      </S.Wrapper>
    )
  }
)
