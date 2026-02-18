# Test Fixtures

This directory contains reusable test data for the RFQ Buddy test suite.

## Available Fixtures

### Users (`users.ts`)
Contains test user accounts for various roles and scenarios:
- Government buyers (multiple users per org)
- Non-government buyers
- Vendors
- Evaluators
- Admin users
- Inactive/locked accounts

### Organizations (`organizations.ts`)
Contains test organization data:
- Government procurement agencies
- Private companies
- Vendor organizations
- Single-user organizations

### Tenders (`tenders.ts`)
Contains sample tender data:
- Draft tenders
- Published tenders
- Closed tenders
- Awarded tenders
- Cancelled tenders
- Various tender types (PG1-PG9A, PW1, PW3, PPS2-PPS6, NRQ1-NRQ3)

### Bids (`bids.ts`)
Contains sample bid data:
- Draft bids
- Submitted bids
- Qualified bids
- Disqualified bids
- Winning bids
- Withdrawn bids

### Tender Types (`tender-types.ts`)
Contains tender type definitions matching the PPR 2008 rules

### Subscriptions (`subscriptions.ts`)
Contains subscription package data:
- free_try
- silver
- gold
- platinum  
- custom

## Usage

```typescript
import { testUsers } from '../fixtures/users';
import { testTenders } from '../fixtures/tenders';

describe('My Test', () => {
  it('should work with fixtures', async () => {
    const buyer = testUsers.govBuyer1;
    const tender = testTenders.draftTender;
    
    // Use in your test...
  });
});
```

## Factory Functions

Fixtures also include factory functions for creating custom test data:

```typescript
import { createTestUser, createTestTender } from '../fixtures';

const customUser = createTestUser({
  email: 'custom@test.com',
  role: 'buyer',
  organizationType: 'government'
});
```

## Database Seeding

For integration tests, you can seed the database with fixtures:

```typescript
import { seedDatabase } from '../fixtures/seed';

beforeAll(async () => {
  await seedDatabase();
});
```
