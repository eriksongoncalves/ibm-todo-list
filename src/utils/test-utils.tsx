import { ReactNode } from 'react'
import { ThemeProvider } from 'styled-components/native'
import { render, RenderOptions } from '@testing-library/react-native'

import { theme } from '@shared/theme'

type AllTheProvidersProps = {
  children: ReactNode
}

export const AllTheProviders = ({ children }: AllTheProvidersProps) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

const customRender = (ui: React.ReactElement<any>, options?: RenderOptions) =>
  render(ui, { wrapper: AllTheProviders, ...options } as RenderOptions)

// re-export everything
export * from '@testing-library/react-native'

// override render method
export { customRender as render }
