/**
 * Test utilities and helper functions
 */

/**
 * Generate a random email for testing
 */
function generateRandomEmail() {
  const random = Math.random().toString(36).substring(7);
  return `test-${random}@example.com`;
}

/**
 * Generate a random username
 */
function generateRandomUsername() {
  const random = Math.random().toString(36).substring(7);
  return `testuser_${random}`;
}

/**
 * Generate a random organization slug
 */
function generateRandomSlug() {
  const random = Math.random().toString(36).substring(7);
  return `test-org-${random}`;
}

/**
 * Generate a random CUID-like string for testing
 * Note: This is not a real CUID, just for testing purposes
 */
function generateTestId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'c';
  for (let i = 0; i < 24; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Create a valid test user payload
 */
function createUserPayload(overrides = {}) {
  return {
    name: 'Test User',
    email: generateRandomEmail(),
    password: 'Test@1234',
    username: generateRandomUsername(),
    ...overrides,
  };
}

/**
 * Create a valid organization payload
 */
function createOrganizationPayload(overrides = {}) {
  return {
    name: 'Test Organization',
    slug: generateRandomSlug(),
    description: 'Test organization description',
    ...overrides,
  };
}

/**
 * Create a valid shipment payload
 */
function createShipmentPayload(overrides = {}) {
  return {
    carrierId: generateTestId(),
    originWarehouseId: generateTestId(),
    destinationWarehouseId: generateTestId(),
    priority: 'NORMAL',
    productName: 'Test Product',
    quantity: 10,
    weight: 50.5,
    estimatedDeliveryTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    ...overrides,
  };
}

/**
 * Create a valid alert payload
 */
function createAlertPayload(overrides = {}) {
  return {
    type: 'SHIPMENT_CREATED',
    severity: 'INFO',
    title: 'Test Alert',
    message: 'This is a test alert message',
    ...overrides,
  };
}

/**
 * Create a valid carrier payload
 */
function createCarrierPayload(overrides = {}) {
  return {
    name: 'Test Carrier',
    code: 'TEST' + Math.random().toString(36).substring(7).toUpperCase(),
    contactEmail: generateRandomEmail(),
    contactPhone: '+1234567890',
    isActive: true,
    ...overrides,
  };
}

/**
 * Create a valid warehouse payload
 */
function createWarehousePayload(overrides = {}) {
  return {
    name: 'Test Warehouse',
    code: 'WH' + Math.random().toString(36).substring(7).toUpperCase(),
    address: '123 Test Street',
    city: 'Test City',
    country: 'Test Country',
    capacity: 1000,
    currentLoad: 0,
    isActive: true,
    ...overrides,
  };
}

/**
 * Create a valid route payload
 */
function createRoutePayload(overrides = {}) {
  return {
    name: 'Test Route',
    originWarehouseId: generateTestId(),
    destinationWarehouseId: generateTestId(),
    distance: 100.5,
    estimatedTime: 120,
    isActive: true,
    ...overrides,
  };
}

/**
 * Wait for a specified time (in milliseconds)
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Extract cookies from response
 */
function extractCookies(response) {
  const cookies = {};
  const setCookie = response.headers['set-cookie'];
  if (setCookie) {
    setCookie.forEach((cookie) => {
      const [nameValue] = cookie.split(';');
      const [name, value] = nameValue.split('=');
      cookies[name.trim()] = value;
    });
  }
  return cookies;
}

/**
 * Extract token from response
 */
function extractToken(response) {
  if (response.body && response.body.data && response.body.data.tokens) {
    return response.body.data.tokens.access.token;
  }
  if (response.body && response.body.data && response.body.data.accessToken) {
    return response.body.data.accessToken;
  }
  return null;
}

/**
 * Generate a test JWT token for authentication
 * @param {Object} user - User object to generate token for
 * @returns {string} JWT access token
 */
function generateTestToken(user) {
  const { generateTokens } = require('./__mocks__/@repo-auth');

  // Use the user object directly
  const { accessToken } = generateTokens(user);
  return accessToken;
}

/**
 * Create a test user with token
 * @param {Object} userOverrides - Optional user properties to override defaults
 * @returns {Object} Object containing user data and auth token
 */
function createTestUserWithToken(userOverrides = {}) {
  const mockDb = require('./__mocks__/@repo-db');

  const testUser = {
    id: generateTestId(),
    name: 'Test User',
    email: 'test@example.com',
    username: 'testuser',
    organizationId: generateTestId(),
    role: 'ADMIN',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...userOverrides,
  };

  // Add user directly to mock storage
  mockDb._storage.users.set(testUser.id, testUser);

  const token = generateTestToken(testUser);

  return {
    user: testUser,
    token,
  };
}

module.exports = {
  generateRandomEmail,
  generateRandomUsername,
  generateRandomSlug,
  generateTestId,
  createUserPayload,
  createOrganizationPayload,
  createShipmentPayload,
  createAlertPayload,
  createCarrierPayload,
  createWarehousePayload,
  createRoutePayload,
  sleep,
  extractCookies,
  extractToken,
  generateTestToken,
  createTestUserWithToken,
};
