# End-to-End (E2E) Testing

This repository uses [Playwright](https://playwright.dev/) through Nx for end-to-end tests. Do **not** use Cypress patterns (`cy.*`, Cypress custom commands, `cypress.json`, `cy:open`, `cy:run`) when adding or changing E2E tests in this monorepo.

## Project Layout

The main E2E project is:

- Project name: `e2e-dh`
- Root: `apps/dh/e2e-dh`
- Specs: `apps/dh/e2e-dh/src/e2e/*.spec.ts`
- Shared fixtures: `apps/dh/e2e-dh/src/fixtures/dh-test.ts`
- Local mocked config: `apps/dh/e2e-dh/playwright.config.ts`
- Deployed-environment config: `apps/dh/e2e-dh/playwright-acceptance-tests.config.ts`

The `e2e-dh` project has an implicit dependency on `app-dh` and depends on generated domain code through Nx targets.

## Running E2E Tests

Prefer Nx targets from the workspace root:

```shell
bun nx run e2e-dh:e2e
```

For CI-style atomized runs, use the generated Nx Playwright CI target:

```shell
bun nx run e2e-dh:e2e-ci
```

For acceptance tests against a deployed environment, use:

```shell
BASE_URL=https://dev002.datahub3.dk \
DH_E2E_USERNAME=<username> \
DH_E2E_PASSWORD=<password> \
bun nx run e2e-dh:e2e-acceptance
```

Notes:

- The local `e2e` target starts the mocked app server via `bun nx run app-dh:serve:mocked` from `playwright.config.ts`.
- The local default `baseURL` is `https://localhost:4200`; override it with `BASE_URL` only when needed.
- Authentication setup requires `DH_E2E_USERNAME` and `DH_E2E_PASSWORD`.
- Nx declares Playwright outputs under `dist/.playwright/apps/dh/e2e-dh/` so reports can be cached and merged.
- To debug a single spec locally, prefer Nx when possible. If you must call Playwright directly, run from `apps/dh/e2e-dh` and keep the command scoped:

  ```shell
  cd apps/dh/e2e-dh
  bun playwright test src/e2e/app-shell.spec.ts --headed
  ```

## Configuration Details

`playwright.config.ts` defines the shared base config and local web server:

- Uses `nxE2EPreset(__filename, { testDir: './src/e2e', openHtmlReport: 'never' })`.
- Starts `bun nx run app-dh:serve:mocked` for local E2E runs.
- Uses `locale: 'da-DK'`.
- Uses `reducedMotion: 'reduce'` to disable animations and avoid element-stability flakes.
- Uses `ignoreHTTPSErrors: true` and Chrome `--ignore-certificate-errors` because local HTTPS uses a self-signed certificate and MSW service worker registration otherwise fails.
- Captures traces on first retry and videos on failure.
- Defines a `setup` Playwright project that runs `auth.setup.ts` and a `chromium` project that depends on it.

`playwright-acceptance-tests.config.ts` reuses the shared base config but removes the local `webServer`; it expects `BASE_URL` to point at an already deployed environment.

## Authentication Fixtures

Authentication is handled by `src/e2e/auth.setup.ts` and `src/fixtures/dh-test.ts`:

1. `auth.setup.ts` logs in through B2C using `DH_E2E_USERNAME` and `DH_E2E_PASSWORD`.
2. It saves browser storage to `.auth/user.json`.
3. It separately serializes MSAL `sessionStorage` to `.auth/session.json` because Playwright `storageState` only captures cookies and localStorage.
4. The custom `test` fixture from `../fixtures/dh-test` replays that session storage before each authenticated test.

Always import from the repository fixture unless there is a specific reason not to:

```typescript
import { test, expect } from '../fixtures/dh-test';
```

For tests that intentionally exercise unauthenticated behavior, opt out explicitly:

```typescript
test.use({ storageState: { cookies: [], origins: [] }, authenticated: false });
```

## Writing Tests

A typical authenticated test should look like this:

```typescript
import { test, expect } from '../fixtures/dh-test';

test.describe('Application shell', () => {
  test('shows the selected actor', async ({ page }) => {
    await page.goto('/message-archive');

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 15_000 });
    await page.getByRole('button', { name: /close/i }).click();
    await expect(dialog).toBeHidden();

    await expect(page.getByRole('heading', { name: /Fremsøg forretningsbeskeder/i })).toBeVisible();

    const selectedActor = page.getByTestId('selectedMarketParticipant');
    await expect(selectedActor).toContainText(/\S/, { timeout: 10_000 });
  });
});
```

## Selector and Assertion Guidelines

Prefer Playwright locators in this order:

1. Accessible roles and names: `page.getByRole('button', { name: /close/i })`
2. Labels: `page.getByLabel(...)`
3. Text for stable user-visible copy
4. Test IDs when the element is not naturally accessible or the visible text is data-dependent: `page.getByTestId(...)`

Avoid:

- CSS selectors tied to implementation structure.
- `page.waitForTimeout(...)` as a replacement for state-based waiting.
- Assertions on exact mocked data when the same spec must work against both mocked local and deployed acceptance environments.
- Cypress APIs (`cy.get`, `cy.visit`, custom Cypress commands).

Use Playwright's auto-waiting and web-first assertions:

```typescript
await expect(page.getByRole('heading', { name: /Aktører/i })).toBeVisible();
await expect(page).toHaveURL(/\/login/);
await expect(page.getByTestId('selectedMarketParticipant')).toContainText(/\S/);
```

## Dealing with App-Specific UI

Some DataHub pages open dialogs or overlays automatically. Close or wait for them before interacting with the page shell because backdrops can block visibility checks and clicks.

Example:

```typescript
const dialog = page.getByRole('dialog');
await expect(dialog).toBeVisible({ timeout: 15_000 });
await page.getByRole('button', { name: /close/i }).click();
await expect(dialog).toBeHidden();
```

When asserting on data that can differ between mocked and deployed environments, assert on stable containers or behavior instead of hard-coded organization names or IDs.

## Reports and Artifacts

Nx and the Playwright preset write outputs below:

- `dist/.playwright/apps/dh/e2e-dh/test-output/`
- `dist/.playwright/apps/dh/e2e-dh/playwright-report/`
- `dist/.playwright/apps/dh/e2e-dh/blob-report/`

Failure artifacts can include traces and videos. Use them to debug before changing selectors or adding broader timeouts.

## Best Practices

- Keep specs user-flow oriented and small enough to debug quickly.
- Prefer role-based locators; add stable `data-testid` only when accessibility locators are not appropriate.
- Use the shared `dh-test` fixture for authenticated tests.
- Keep unauthenticated tests explicit with `authenticated: false` and empty `storageState`.
- Make tests resilient across local mocked and deployed acceptance environments when they are intended to run in both.
- Prefer state-based waits and web-first assertions over arbitrary sleeps.
- Run the narrowest relevant Nx E2E target after changing tests or app behavior covered by tests.
