# HTTP API Test Suite

This directory contains comprehensive test suites for all HTTP API endpoints in the supply chain management system.

## Test Structure

```
apps/tests/
├── setup/
│   ├── setupTests.js       # Global test setup and configuration
│   └── testUtils.js        # Helper functions for testing
├── jest.config.js          # Jest configuration
├── auth.test.js           # Authentication endpoints tests
├── shipment.test.js       # Shipment CRUD operations tests
├── alert.test.js          # Alert management tests
├── organization.test.js   # Organization management tests
├── carrier.test.js        # Carrier management tests
├── warehouse.test.js      # Warehouse management tests
├── route.test.js          # Route management tests
├── activity.test.js       # Activity feed tests
└── dashboard.test.js      # Dashboard statistics tests
```

## Prerequisites

Install the required dependencies:

```bash
cd apps/tests
npm install --save-dev jest supertest @types/jest @types/supertest
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run specific test file
```bash
npm test auth.test.js
```

### Run tests matching a pattern
```bash
npm test -- --testNamePattern="should create"
```

## Test Modules

### 1. Authentication Tests (`auth.test.js`)
Tests for user authentication and authorization:
- User registration
- User login
- Token refresh
- Logout

### 2. Shipment Tests (`shipment.test.js`)
Tests for shipment operations:
- Create shipment
- Get all shipments with filters
- Get shipment by ID
- Update shipment
- Update shipment status
- Update shipment location
- Delete shipment

### 3. Alert Tests (`alert.test.js`)
Tests for alert management:
- Create alert
- Get alerts with filters (type, severity, isRead, shipmentId)
- Get alert by ID
- Mark alert as read/unread
- Delete alert

### 4. Organization Tests (`organization.test.js`)
Tests for organization management:
- Get all organizations
- Get organization by ID
- Update organization
- Delete organization

### 5. Carrier Tests (`carrier.test.js`)
Tests for carrier management:
- Create carrier
- Get all carriers
- Get carrier by ID
- Update carrier
- Delete carrier

### 6. Warehouse Tests (`warehouse.test.js`)
Tests for warehouse management:
- Create warehouse
- Get all warehouses
- Get warehouse by ID
- Update warehouse
- Delete warehouse

### 7. Route Tests (`route.test.js`)
Tests for route management:
- Create route
- Get all routes
- Get route by ID
- Update route
- Delete route

### 8. Activity Tests (`activity.test.js`)
Tests for activity feed:
- Get all activities
- Filter by userId, type
- Pagination support

### 9. Dashboard Tests (`dashboard.test.js`)
Tests for dashboard statistics:
- Get dashboard stats
- Get dashboard metrics
- Get dashboard overview
- Filter by date range

## Test Utilities

The `setup/testUtils.js` file provides helper functions:

- `generateRandomEmail()` - Generate unique test email
- `generateRandomUsername()` - Generate unique test username
- `generateTestId()` - Generate CUID-like test ID
- `createUserPayload()` - Create valid user data
- `createShipmentPayload()` - Create valid shipment data
- `createAlertPayload()` - Create valid alert data
- `createCarrierPayload()` - Create valid carrier data
- `createWarehousePayload()` - Create valid warehouse data
- `createRoutePayload()` - Create valid route data
- `extractToken()` - Extract auth token from response

## Environment Variables

Create a `.env.test` file in the root directory:

```env
NODE_ENV=test
JWT_SECRET=test-jwt-secret-key-for-testing
JWT_EXPIRES_IN=1h
DATABASE_URL=your-test-database-url
```

## Writing New Tests

When adding new test files:

1. Follow the naming convention: `<module>.test.js`
2. Import required dependencies:
```javascript
const request = require('supertest');
const app = require('../../http/src/app').default;
const { testUtils } = require('../setup/testUtils');
```

3. Structure tests using describe blocks:
```javascript
describe('Module Endpoints', () => {
  describe('GET /api/v0/endpoint', () => {
    it('should do something', async () => {
      // test implementation
    });
  });
});
```

4. Always test both success and failure cases
5. Test authentication requirements
6. Test input validation
7. Clean up test data after tests

## Best Practices

1. **Isolation**: Each test should be independent
2. **Authentication**: Use test tokens or mock authentication
3. **Data Cleanup**: Clean up test data to avoid side effects
4. **Assertions**: Use specific assertions with clear expectations
5. **Error Cases**: Test both valid and invalid inputs
6. **Coverage**: Aim for comprehensive endpoint coverage

## Troubleshooting

### Tests failing with 401 Unauthorized
- Ensure you're using valid authentication tokens
- Check if the auth middleware is properly configured

### Database connection errors
- Verify your test database configuration
- Ensure test database migrations are run

### Port already in use
- Make sure no other instance of the app is running
- Use a different port for testing

## Contributing

When adding new endpoints or modifying existing ones:
1. Update corresponding test file
2. Add new test cases for new functionality
3. Ensure all tests pass before committing
4. Maintain test coverage above 80%

## Notes

- Tests use plain JavaScript (not TypeScript) for simplicity
- Supertest is used for HTTP assertions
- Jest is configured with a 30-second timeout for integration tests
- Mock data generators ensure unique test data for each run
