module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Запускаем ТОЛЬКО новые тесты
  testMatch: ['**/__tests__/**/*.test.ts'],

  // Явно игнорируем старые тесты
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/battle/',
    '<rootDir>/src/characters/',
    '<rootDir>/src/builders/',
    '<rootDir>/src/logging/'
  ]
};
