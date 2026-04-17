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

import { test, expect } from './dh-test';

test.describe('Language selection', () => {
  test.skip();

  const initialUrl = '/message-archive';

  test.beforeEach(async ({ login }) => {
    await login(initialUrl);
  });

  test('toggle languages', async ({ page }) => {
    await page.goto(initialUrl);

    // Given no language is selected
    // Then Danish translations are displayed
    await expect(page.getByRole('heading', { name: /Fremsøg forretningsbeskeder/i })).toBeVisible();

    // When English is selected
    // Then English translations are displayed
    await page.getByTestId('profileMenu').click();
    await page.getByText('English').click();

    // Handle the auto-opening modal
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 10_000 });
    await page.getByRole('button', { name: /close/i }).click();
    await expect(dialog).toBeHidden();

    await expect(
      page.getByRole('heading', { name: /Search in request and response messages/i })
    ).toBeVisible();

    // Given English is selected
    // When Danish is selected
    // Then Danish translations are displayed
    await page.getByTestId('profileMenu').click();
    await page.getByText('Dansk').click();

    await expect(page.getByRole('heading', { name: /Fremsøg forretningsbeskeder/i })).toBeVisible();
  });
});
