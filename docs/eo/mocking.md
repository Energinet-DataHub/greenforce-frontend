# Mocking Documentation

## Overview

This project uses [Mock Service Worker (MSW)](https://mswjs.io/docs/) to mock HTTP requests for API testing and development. MSW provides a seamless way to intercept and mock HTTP requests without modifying your application code.

## Directory Structure

- **Mocks Location**: `libs/eo/shared/data-access-mocks/src/lib`
- **Mock Registration**: `libs/eo/shared/data-access-mocks/src/index.ts`
- **MSW Initialization**: `libs/eo/shared/environments/src/lib/environment.mocked.ts`

## Running with Mocks

### Default Behavior

By default, the application runs against the environment specified in:

```json
libs/eo/shared/assets/src/assets/configuration/eo-api-environment.local.json
```

### Starting Mocked Environment

To run the application with mocks:

```bash
bun eo:mock

# or the equivalent full command
bun nx run app-eo:serve:mocked
```

These commands start the development server with mock data instead of real API connections. The mock configuration is defined in `apps/eo/app-eo/project.json`.

> **Note**: Unmocked requests will fall back to the API specified in the environment file.

## Creating New Mocks

1. Add mock files in `libs/eo/shared/data-access-mocks/src/lib`
2. Import and register mocks in `libs/eo/shared/data-access-mocks/src/index.ts`
3. Follow [MSW's REST API mocking guide](https://mswjs.io/docs/getting-started/mocks/rest-api) for implementation details

## Testing Integration

### Jest Configuration

Add the following to your `test-setup.ts`:

```typescript
import { setupMSWServer } from '@energinet-datahub/gf/test-util-msw';
import { eoLocalApiEnvironment } from '@energinet-datahub/eo/shared/assets';
import { mocks } from '@energinet-datahub/eo/shared/data-access-mocks';

setupMSWServer(eoLocalApiEnvironment.apiBase, mocks);
```

#### Custom Test Mocks

- Use [runtime request handlers](https://mswjs.io/docs/api/setup-server/use) to override existing mocks or add new ones for specific tests

### Cypress E2E & Component Testing

#### E2E

`e2e-eo` run automatically against the mocked environment using Cypress configured here `apps/eo/e2e-eo/project.json`.

#### Component testing

Component tests run automatically against the mocked environment using Cypress. Here's how the configuration works in your NX project:

```json
"component-test": {
  "executor": "@nx/cypress:cypress",
  "options": {
    "cypressConfig": "libs/eo/<domain>/<your library>/cypress.config.ts",
    "testingType": "component",
    "skipServe": true,
    "devServerTarget": "app-eo:build:mocked"
  }
}
```

When setting up tests for new libraries:

1. Reference `libs/eo/activity-log/shell/project.json` for a working example
2. Update the cypressConfig path to match your library's location
3. Keep the devServerTarget pointing to the mocked build configuration

This ensures your component tests run against consistent, mocked data instead of live services.

### Authentication Mocking Limitations

> **Warning**: Currently, there is no robust solution for mocking tokens/claims. This is a known limitation.

## Best Practices

1. Share mocks between development and testing environments when possible
2. Maintain consistency between manual testing and automated test mocks
3. Document any custom mock implementations
4. Keep mock data realistic and representative of actual API responses
