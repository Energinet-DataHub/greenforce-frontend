# Vitest Migration Status for dh-shared-util-apollo

## Status: BLOCKED ❌ (but Jest tests now working ✅)

## Issue

The `apollo-angular/testing` module is not compatible with Vitest. When attempting to migrate, we encounter EISDIR errors due to module resolution issues.

## Root Cause

- `apollo-angular/testing` is specifically designed for Jest and Angular's TestBed
- The `ApolloTestingModule` and `ApolloTestingController` are tightly coupled with Jest's mocking system
- Vitest's module resolution differs from Jest's, causing compatibility issues

## Attempted Solutions

1. ✅ Created vite.config.mts with Angular plugin
2. ✅ Updated project.json to use @nx/vite:test
3. ✅ Updated tsconfig.spec.json with Vitest types
4. ✅ Modified test-setup.ts for Vitest
5. ❌ Tests fail with EISDIR error when importing apollo-angular/testing

## Recommended Actions

### Short-term: Keep Jest

Continue using Jest for this library until apollo-angular provides Vitest support.

### Long-term: Refactor Tests

Refactor the tests to use direct mocking instead of apollo-angular/testing:

```typescript
// Instead of:
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';

// Use:
import { vi } from 'vitest';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

const mockApollo = {
  watchQuery: vi.fn().mockReturnValue({
    valueChanges: of({ data: {}, loading: false }),
  }),
  mutate: vi.fn().mockReturnValue(of({ data: {} })),
};

TestBed.configureTestingModule({
  providers: [{ provide: Apollo, useValue: mockApollo }],
});
```

## Files Affected

- src/lib/query.spec.ts (3 tests)
- src/lib/mutation.spec.ts (3 tests)
- src/lib/lazyQuery.spec.ts (3 tests)

## Dependencies

- apollo-angular: 11.0.0
- @apollo/client: 3.11.11

## Related Issues

- https://github.com/apollographql/apollo-angular/issues (check for Vitest support)

## Temporary Fix

- Fixed Jest tests by overriding the custom jsdom environment with standard `jest-environment-jsdom`
- Tests are now passing with Jest

## Decision Log

- 2024-01-23: Attempted migration, blocked by apollo-angular/testing compatibility
- 2024-01-23: Fixed Jest tests by using standard jsdom environment
- Next review: When apollo-angular releases Vitest-compatible testing utilities
