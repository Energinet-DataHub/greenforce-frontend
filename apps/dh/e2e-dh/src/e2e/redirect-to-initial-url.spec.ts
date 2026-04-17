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

import { test, expect } from '@playwright/test';

test.describe('Redirect to initial URL', () => {
  const initialUrl = '/market-participant/actors';

  test('should have correct redirectTo value before login', async ({ page }) => {
    await page.goto(initialUrl);

    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
    const url = page.url();
    expect(url).toContain(`dhRedirectTo=${encodeURIComponent(initialUrl)}`);
  });

  test.describe('After login', () => {
    test.skip();

    test('should display correct page title after login', async ({ page }) => {
      await page.goto(initialUrl);

      const heading = page.getByRole('heading', { name: /Aktører/i, level: 2 });
      await expect(heading).toBeVisible();
    });
  });

  test.describe('After logout', () => {
    test.skip();

    const logoutInitialUrl = '/grid-areas';

    test('should redirect back to login page after manual logout', async ({ page }) => {
      await page.goto(logoutInitialUrl);

      await page.getByTestId('profileMenu').click();
      await page.getByText('Log ud').click();

      await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
      const url = page.url();
      expect(url).toContain(`dhRedirectTo=${encodeURIComponent('/')}`);
    });
  });
});
