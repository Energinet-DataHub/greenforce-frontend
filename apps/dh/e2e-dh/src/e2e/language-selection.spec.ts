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

test.describe('Language selection', () => {
  const initialUrl = '/message-archive';

  test('toggles between Danish and English', async ({ page }) => {
    await page.goto(initialUrl);

    // Close the auto-opening "New search" dialog before interacting with the profile menu;
    // its backdrop blocks visibility checks on the page shell underneath.
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 15_000 });
    await page.getByRole('button', { name: /close/i }).click();
    await expect(dialog).toBeHidden();

    // Default locale is Danish
    await expect(page.getByRole('heading', { name: /Fremsøg forretningsbeskeder/i })).toBeVisible();

    // Switch to English via the profile menu. The menu item shows the OTHER language name.
    await page.getByTestId('profileMenu').click();
    await page.getByRole('menuitem', { name: 'English' }).click();
    await expect(
      page.getByRole('heading', { name: /Search in request and response messages/i })
    ).toBeVisible();

    // Switch back to Danish
    await page.getByTestId('profileMenu').click();
    await page.getByRole('menuitem', { name: 'Dansk' }).click();
    await expect(page.getByRole('heading', { name: /Fremsøg forretningsbeskeder/i })).toBeVisible();
  });
});
