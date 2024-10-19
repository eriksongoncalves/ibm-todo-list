jest.mock('react-native-progress', () => {
  const reactNative = jest.requireActual('react-native')
  const { View } = reactNative

  return {
    __esModule: true,
    Bar: View
  }
})
