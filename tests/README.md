# RFQ Buddy Test Suite

This directory contains comprehensive test coverage for the RFQ Buddy platform following the **MASTER_TESTING_PLAN_REVISED.md**.

## Directory Structure

```
tests/
├── unit/                    # Unit tests for services, utilities
│   ├── services/           # Service layer tests
│   ├── middleware/         # Middleware tests  
│   ├── utils/              # Utility function tests
│   └── schemas/            # Schema validation tests
├── integration/            # Integration/API tests
│   ├── auth/               # Authentication endpoints
│   ├── tender/             # Tender endpoints
│   ├── bid/                # Bid endpoints
│   ├── evaluation/         # Evaluation endpoints
│   ├── award/              # Award endpoints
│   ├── vendor/             # Vendor endpoints
│   ├── subscription/       # Subscription endpoints
│   ├── notification/       # Notification endpoints
│   └── export/             # Export endpoints
├── e2e/                    # End-to-end tests (Frontend)
│   ├── auth/               # Authentication flows
│   ├── tender-creation/    # Tender creation flows
│   ├── bid-submission/     # Bid submission flows
│   ├── evaluation/         # Evaluation flows
│   ├── award/              # Award flows
│   └── live-tendering/     # Live tendering flows
├── performance/            # Performance/load tests
├── security/               # Security tests
├── accessibility/          # Accessibility tests
└── fixtures/               # Test data fixtures
    ├── users.ts            # Test user data
    ├── tenders.ts          # Test tender data
    ├── bids.ts             # Test bid data
    └── README.md           # Fixture documentation

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm test -- tests/unit
```

### Integration Tests Only
```bash
npm test -- tests/integration
```

### Specific Test File
```bash
npm test -- tests/unit/services/auth.service.test.ts
```

### With Coverage
```bash
npm test -- --coverage
```

### Watch Mode
```bash
npm test -- --watch
```

## Test Coverage Goals

| Type | Target | Current |
|------|--------|---------|
| Unit Tests | 500+ tests | ??? |
| Integration Tests | 400+ tests | ??? |
| E2E Tests | 200+ tests | ??? |
| Line Coverage | 80% | ??? |
| Branch Coverage | 80% | ??? |
| Function Coverage | 80% | ??? |

## Writing Tests

### Unit Test Example
```typescript
import { authService } from '../../src/services/auth.service';

describe('AuthService', () => {
  describe('register', () => {
    it('should create user and organization', async () => {
      // Arrange
      const userData = { ... };
      
      // Act
      const result = await authService.register(userData);
      
      // Assert
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
    });
  });
});
```

### Integration Test Example
```typescript
import request from 'supertest';
import app from '../../src/app';

describe('POST /api/auth/register', () => {
  it('should register new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ ... })
      .expect(201);
      
    expect(response.body).toHaveProperty('accessToken');
  });
});
```

## Test Data Management

- Test fixtures are located in `tests/fixtures/`
- Use factory functions for creating test data
- Clean up test data in `afterEach` or `afterAll` hooks
- Use transactions for database tests when possible

## Continuous Integration

Tests are run automatically on:
- Every commit (unit tests)
- Every PR (unit + integration tests)
- Before deployment (full test suite)

## Documentation

For detailed testing specifications, see:
- [Master Testing Plan](../plans/MASTER_TESTING_PLAN_REVISED.md)
- [Platform Technical PRD](../plans/RFQ_Tendering_Platform_Technical_PRD_v4.md)
