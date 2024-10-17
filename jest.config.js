module.exports = {
  preset: 'react-native',
  testPathIgnorePatterns: ['/node_modules', '/android', '/ios', '/.expo'],
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    './src/utils/jest/__mocks__/vector-icons.ts'
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
