/**
 * Mock for @repo/logger package
 */

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

const httpLogger = jest.fn((app) => app);

module.exports = {
  logger: mockLogger,
  httpLogger,
};
