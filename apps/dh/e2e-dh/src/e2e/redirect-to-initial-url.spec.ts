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

import { test, expect } from '../fixtures/dh-test';

test.describe('Redirect to initial URL', () => {
  const initialUrl = '/market-participant/actors';

  test.describe('Before login', () => {
    // Opt out of the authenticated state: clear cookies/localStorage via storageState and
    // disable the sessionStorage replay fixture.
    test.use({ storageState: { cookies: [], origins: [] }, authenticated: false });

    test('redirects to /login with dhRedirectTo preserved', async ({ page }) => {
      await page.goto(initialUrl);

      await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
      expect(page.url()).toContain(`dhRedirectTo=${encodeURIComponent(initialUrl)}`);
    });
  });

  test.describe('After login', () => {
    test('shows the actors page heading', async ({ page }) => {
      await page.goto(initialUrl);

      await expect(page.getByRole('heading', { name: /Aktører/i, level: 2 })).toBeVisible();
    });
  });

  test.describe('After logout', () => {
    const logoutInitialUrl = '/grid-areas';

    test('redirects back to the login page', async ({ page }) => {
      await page.goto(logoutInitialUrl);

      await page.getByTestId('profileMenu').click();
      await page.getByRole('menuitem', { name: /log ud|sign out/i }).click();

      await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
      expect(page.url()).toContain(`dhRedirectTo=${encodeURIComponent('/')}`);
    });
  });
});
