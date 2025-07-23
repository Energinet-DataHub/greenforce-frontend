# Apollo-Angular Vitest Migration Notes

## Issue
The `apollo-angular/testing` module is not compatible with Vitest, causing EISDIR errors when attempting to run tests.

## Potential Solutions

### 1. Direct Mocking (Recommended)
Replace `ApolloTestingModule` and `ApolloTestingController` with direct mocks:

```typescript
// Instead of:
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';

// Use:
import { vi } from 'vitest';
import { of } from 'rxjs';

const mockApolloController = {
  expectOne: vi.fn(),
  verify: vi.fn(),
  expectNone: vi.fn()
};
```

### 2. Keep Jest for Apollo Tests
Maintain Jest configuration specifically for Apollo tests while using Vitest for everything else.

### 3. Create Custom Testing Utilities
Build Vitest-compatible testing utilities that mimic ApolloTestingModule's behavior.

## Files Affected
- src/lib/query.spec.ts
- src/lib/mutation.spec.ts
- src/lib/lazyQuery.spec.ts

## Decision
To be determined based on team preference and timeline constraints.