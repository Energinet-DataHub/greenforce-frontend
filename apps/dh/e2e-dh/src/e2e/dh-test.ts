//#region License
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//#endregion
import { test as base, expect, type Page, type BrowserContext } from '@playwright/test';

/**
 * Removes the cookie consent banner by setting the `CookieInformationConsent` cookie.
 * This is the Playwright equivalent of the old Cypress `removeCookieBanner` command.
 */
async function removeCookieBanner(context: BrowserContext, baseURL: string) {
  const url = new URL(baseURL);
  await context.addCookies([
    {
      name: 'CookieInformationConsent',
      value: encodeURIComponent('{"consents_approved":[]}'),
      domain: url.hostname,
      path: '/',
      sameSite: 'Lax',
      secure: true,
    },
  ]);
}

/**
 * Logs in via the Azure AD B2C login page.
 * This is the Playwright equivalent of the old Cypress `login` command.
 */
async function loginViaB2C(page: Page, email: string, password: string, initialUrl: string) {
  // Click the login button on the app's login page
  await page.locator('watt-button').click();

  // Fill in the B2C login form
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  await page.locator('#next').click();

  // Wait for redirect back to the app
  if (initialUrl === '/') {
    // User might be redirected to either metering-point/search or message-archive based on permissions
    await expect(page).toHaveURL(/\/(metering-point\/search|message-archive)/, { timeout: 30_000 });
  } else {
    await expect(page).toHaveURL(new RegExp(initialUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), {
      timeout: 30_000,
    });
  }
}

/**
 * Extended Playwright test fixture that provides `login` and `removeCookieBanner` helpers.
 *
 * Usage:
 * ```ts
 * import { test, expect } from './dh-test';
 *
 * test('my test', async ({ login, page }) => {
 *   await login('/some-page');
 *   // page is now authenticated
 * });
 * ```
 */
export const test = base.extend<{
  /** Removes the cookie consent banner before the test. */
  removeCookieBanner: () => Promise<void>;
  /** Logs in via B2C with the test user credentials. */
  login: (initialUrl?: string) => Promise<void>;
}>({
  removeCookieBanner: async ({ context, baseURL }, use) => {
    await use(async () => {
      await removeCookieBanner(context, baseURL ?? 'https://localhost:4200');
    });
  },

  login: async ({ page, context, baseURL }, use) => {
    await use(async (initialUrl = '/') => {
      const email = process.env['DH_E2E_USERNAME'] ?? '';
      const password = process.env['DH_E2E_PASSWORD'] ?? '';

      if (!email || !password) {
        throw new Error(
          'DH_E2E_USERNAME and DH_E2E_PASSWORD environment variables must be set for login'
        );
      }

      // Remove cookie banner before visiting
      await removeCookieBanner(context, baseURL ?? 'https://localhost:4200');

      await page.goto(initialUrl);

      await loginViaB2C(page, email, password, initialUrl);
    });
  },
});

export { expect };
