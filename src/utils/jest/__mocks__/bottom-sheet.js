jest.mock('@gorhom/bottom-sheet', () => {
  const reactNative = jest.requireActual('react-native')
  const { View } = reactNative

  return {
    __esModule: true,
    default: View,
    BottomSheetModal: View,
    BottomSheetModalProvider: View,
    BottomSheetScrollView: View,
    useBottomSheetModal: () => ({
      present: () => {},
      dismiss: () => {}
    })
  }
})
