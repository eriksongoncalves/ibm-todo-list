import { useState } from 'react'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { tv, VariantProps } from 'tailwind-variants'

const variants = tv({
  base: 'rounded-8 w-full items-center rounded p-4',
  variants: {
    variant: {
      default: 'border-green-700 bg-green-700',
      outline: 'border border-green-500 bg-transparent',
      ghost: 'w-auto p-0'
    }
  },

  defaultVariants: {
    variant: 'default'
  }
})

type ButtonVariants = VariantProps<typeof variants>

type ButtonProps = {
  className?: string
} & ButtonVariants &
  Omit<TouchableOpacityProps, 'onPressIn' | 'onPressOut'>

export function Button({ className, children, variant, ...rest }: ButtonProps) {
  const [activeClasses, setActiveClasses] = useState('')

  function handlePressIn() {
    const activeVariants = {
      default: 'border-green-500 bg-green-500',
      outline: 'border-green-700 bg-green-700',
      ghost: ''
    }

    setActiveClasses(activeVariants[variant!])
  }

  function handlePressOut() {
    setActiveClasses('')
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className={variants({ variant, className: activeClasses })}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  )
}
