jest.mock('react-native-element-dropdown', () => {
  const reactNative = jest.requireActual('react-native')
  const { View } = reactNative

  return {
    __esModule: true,
    Dropdown: View
  }
})
