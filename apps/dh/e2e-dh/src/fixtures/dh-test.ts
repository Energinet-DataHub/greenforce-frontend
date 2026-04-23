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

async function loginViaB2C(page: Page, email: string, password: string, initialUrl: string) {
  await page.getByRole('button', { name: /login.*(brugernavn|username)/i }).click();

  // B2C-controlled DOM below: we do not own these selectors, so CSS IDs are a pragmatic fallback.
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  await page.locator('#next').click();

  if (initialUrl === '/') {
    // Permissions may land the user on either metering-point/search or message-archive.
    await expect(page).toHaveURL(/\/(metering-point\/search|message-archive)/, { timeout: 30_000 });
  } else {
    await expect(page).toHaveURL(new RegExp(initialUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), {
      timeout: 30_000,
    });
  }
}

/**
 * Extended Playwright test with `login` and `removeCookieBanner` helpers.
 *
 * Usage:
 * ```ts
 * import { test, expect } from '../fixtures/dh-test';
 *
 * test('my test', async ({ login, page }) => {
 *   await login('/some-page');
 * });
 * ```
 */
export const test = base.extend<{
  removeCookieBanner: () => Promise<void>;
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

      await removeCookieBanner(context, baseURL ?? 'https://localhost:4200');
      await page.goto(initialUrl);
      await loginViaB2C(page, email, password, initialUrl);
    });
  },
});

export { expect };
