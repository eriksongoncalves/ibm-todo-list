module.exports = function (api) {
  api.cache(false)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env'
        }
      ],
      [
        'module-resolver',
        {
          root: ['./src/'],
          extensions: ['.ts', '.tsx', '.js', '.json'],
          alias: {
            '@components': './src/components',
            '@screens': './src/screens',
            '@assets': './src/assets',
            '@shared': './src/shared',
            '@routes': './src/routes',
            '@hooks': './src/hooks',
            '@utils': './src/utils'
          }
        }
      ]
    ]
  }
}
