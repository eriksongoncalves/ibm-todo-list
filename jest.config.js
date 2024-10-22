module.exports = {
  preset: 'react-native',
  testPathIgnorePatterns: ['/node_modules', '/android', '/ios', '/.expo'],
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    './src/utils/jest/__mocks__/vector-icons.js',
    './src/utils/jest/__mocks__/react-native-reanimated.js',
    './src/utils/jest/__mocks__/bottom-sheet.js',
    './src/utils/jest/__mocks__/react-native-progress.js',
    './src/utils/jest/__mocks__/react-native-iphone-x-helper.js',
    './src/utils/jest/__mocks__/utils-analitycs.js',
    './node_modules/react-native-gesture-handler/jestSetup.js'
  ],
  modulePaths: ['<rootDir>/src/'],
  collectCoverageFrom: [
    'src/**/*.ts(x)?',
    '!src/routes/**',
    '!src/shared/types/**',
    '!src/shared/theme.ts',
    '!src/**/**/validationSchema.ts',
    '!src/hooks/auth/types.ts'
  ]
}
