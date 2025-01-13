module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-navigation|@react-native-community|@react-native-firebase|@react-native/js-polyfills|react-native-reanimated|react-native-svg|react-native-vector-icons|react-native-push-notification)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^@supabase/supabase-js$': '<rootDir>/__mocks__/supabase.js',
  },
  setupFiles: [
    '<rootDir>/jest.setup.js',
  ],
};
