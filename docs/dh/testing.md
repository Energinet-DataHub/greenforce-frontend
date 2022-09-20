# Testing

## Unit / Integration Testing

Currently the test suites are integrating with the BFF (Backend-for-Frontend), so to run the tests succesfully make sure you're already serving the backend locally.

`yarn test`

While developing you can run the tests in watch mode:

`yarn test --watch`

### Debugging Jest tests

You can use [Jest Preview](https://github.com/nvh95/jest-preview) to visually debug Jest tests.

In order to do that, you need to:

1. Start the Jest Preview Server by running `yarn jest-preview` in a Terminal. A new page will open in the browser where failing tests can be previewed.
2. Add `debug()` to the test you want to debug.

```ts
import { debug } from 'jest-preview';

describe('AppComponent', () => {
  it('should work as expected', () => {
    // ...
    debug();
    // ...
  });
});
```

## E2E Testing

Due to the limitations of Cypress authenticating against MSAL (B2C), we have chosen to use Playwright for our E2E tests. To be able to running the tests locally, you will need to rename `apps\dh\e2e-dh\.env` to `apps\dh\e2e-dh\.env.local` and insert some testing user credentials.

To run the tests use following command:

`yarn nx run e2e-dh:e2e`

To debug E2E tests with the Playwright inspector you can use following command (Windows PowerShell), you can find more information [here](https://playwright.dev/docs/debug):

`yarn nx run e2e-dh:e2e --debug`
