/**
 * Mock for @repo/auth package
 */

const jwt = require('jsonwebtoken');

const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-key-for-testing';
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'test-jwt-refresh-secret-key-for-testing';
const JWT_ACCESS_TOKEN_EXPIRY = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_TOKEN_EXPIRY = '7d';

const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRY });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET, { expiresIn: JWT_REFRESH_TOKEN_EXPIRY });
};

const generateTokens = (user) => {
  const payload = {
    id: user.id,
    name: user.name || '',
    email: user.email,
    username: user.username,
    organizationId: user.organizationId,
    role: user.role,
  };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  return { accessToken, refreshToken };
};

const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    return false;
  }
};

const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    return false;
  }
};

module.exports = {
  generateTokens: jest.fn(generateTokens),
  verifyToken: jest.fn(verifyAccessToken),
  verifyAccessToken: jest.fn(verifyAccessToken),
  verifyRefreshToken: jest.fn(verifyRefreshToken),
  hashPassword: jest.fn((password) => Promise.resolve(`hashed_${password}`)),
  comparePassword: jest.fn((password, hash) => Promise.resolve(hash === `hashed_${password}`)),
};
