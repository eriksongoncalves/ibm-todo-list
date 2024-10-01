import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config'

const fullConfig = resolveConfig(tailwindConfig)

const { colors, fontFamily, fontSize } = fullConfig.theme!

export default {
  fontFamily,
  fontSize,
  colors
} as any
