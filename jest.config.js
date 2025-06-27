// jest.config.js
module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@api$': '<rootDir>/src/utils/mock-api', // Мокаем @api
    '^@utils-types$': '<rootDir>/src/utils/types'
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts']
};
