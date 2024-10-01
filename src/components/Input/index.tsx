import { useState, forwardRef } from 'react'
import { TextInput, TextInputProps, Text } from 'react-native'
import { tv } from 'tailwind-variants'

import theme from '@shared/tailwindConfig'

const variants = tv({
  base: 'rounded-8 w-full rounded border border-gray-600 bg-gray-600 p-4 font-robotoRegular text-base text-gray-200',
  variants: {
    error: {
      true: 'border-red-600'
    },
    active: {
      true: 'border-green-700'
    },
    disabled: {
      true: 'text-gray-500'
    }
  }
})

type InputProps = {
  style?: string
  disabled?: boolean
  errorMessage?: string
} & TextInputProps

export const Input = forwardRef<TextInput, InputProps>(
  ({ errorMessage, disabled, onBlur, ...rest }, ref) => {
    const [isFocused, setIsFocused] = useState(false)

    function handleInputFocus() {
      setIsFocused(true)
    }

    function handleInputBlur() {
      setIsFocused(false)
    }

    return (
      <>
        <TextInput
          ref={ref}
          className={variants({
            active: isFocused && !errorMessage,
            error: !!errorMessage
          })}
          autoCorrect={false}
          autoCapitalize="none"
          editable={!disabled}
          onFocus={handleInputFocus}
          onBlur={e => {
            !!onBlur && onBlur(e)
            handleInputBlur()
          }}
          placeholderTextColor={theme.colors.gray['300']}
          {...rest}
          style={[
            rest?.style,
            {
              marginBottom: !!errorMessage
                ? 0
                : (rest?.style?.[0] as any)?.marginBottom || 0
            }
          ]}
        />

        {!!errorMessage && (
          <Text
            style={[
              {
                marginBottom: (rest?.style?.[0] as any)?.marginBottom || 0
              }
            ]}
            className="mt-1 font-robotoRegular text-xs text-red-600"
          >
            {errorMessage}
          </Text>
        )}
      </>
    )
  }
)
