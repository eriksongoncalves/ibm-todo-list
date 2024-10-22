jest.mock('react-native-iphone-x-helper', () => ({
  getStatusBarHeight: jest.fn(),
  getBottomSpace: jest.fn()
}))
