module.exports = {
  connectPublisher: jest.fn().mockResolvedValue(),
  connectSubscriber: jest.fn().mockResolvedValue(),
  publish: jest.fn().mockResolvedValue(),
  subscribe: jest.fn().mockResolvedValue(),
  disconnectPublisher: jest.fn().mockResolvedValue(),
  getRedisClient: jest.fn().mockReturnValue({
    on: jest.fn(),
    quit: jest.fn()
  })
};
