/**
 * Jest configuration for HTTP API testing
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.json'
    }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@repo)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../http/src/$1',
    '^@repo/db$': '<rootDir>/setup/__mocks__/@repo-db.js',
    '^@repo/shared(.*)$': '<rootDir>/../../packages/shared/src$1',
    '^@repo/logger(.*)$': '<rootDir>/setup/__mocks__/@repo-logger.js',
    '^@repo/redis(.*)$': '<rootDir>/setup/__mocks__/@repo-redis.js',
    '^swagger-jsdoc$': '<rootDir>/setup/__mocks__/swagger-jsdoc.js',
    '^@clerk/clerk-sdk-node$': '<rootDir>/setup/__mocks__/@clerk.js',
  },
  collectCoverageFrom: [
    '../http/src/**/*.{js,ts}',
    '!../http/src/**/*.d.ts',
    '!../http/src/**/*.interface.ts',
    '!../http/src/**/*.type.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/setup/setupTests.js'],
  testTimeout: 30000,
  verbose: true,
  clearMocks: false,
  resetMocks: false,
  restoreMocks: false,
};

