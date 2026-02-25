/**
 * Mock for @repo/redis package
 */

module.exports = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn(),
  quit: jest.fn(),
};
