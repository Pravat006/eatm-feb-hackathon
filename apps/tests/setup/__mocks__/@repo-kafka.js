/**
 * Mock for @repo/kafka package
 */

module.exports = {
  producer: {
    send: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
  },
  consumer: {
    subscribe: jest.fn(),
    run: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
  },
};
