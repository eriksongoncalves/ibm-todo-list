jest.mock('@expo/vector-icons', () => {
  const reactNative = jest.requireActual('react-native')
  const { View } = reactNative

  return {
    MaterialCommunityIcons: props => (
      <View {...props} key="MaterialCommunityIcons" />
    ),
    MaterialIcons: props => <View {...props} key="MaterialIcons" />,
    AntDesign: props => <View {...props} key="AntDesign" />,
    Ionicons: props => <View {...props} key="Ionicons" />
  }
})
