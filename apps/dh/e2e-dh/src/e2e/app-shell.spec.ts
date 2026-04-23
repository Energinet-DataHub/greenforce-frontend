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

test.describe('Application shell', () => {
  test.skip();

  const initialUrl = '/message-archive';

  test.beforeEach(async ({ login }) => {
    await login(initialUrl);
  });

  test('should display welcome message', async ({ page }) => {
    await page.goto(initialUrl);

    await expect(page.getByRole('heading', { name: /Fremsøg forretningsbeskeder/i })).toBeVisible();

    const selectedActor = page.getByTestId('selectedMarketParticipant');
    await expect(selectedActor).toBeVisible({ timeout: 10_000 });

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await page.getByRole('button', { name: /close/i }).click();
    await expect(dialog).toBeHidden();

    await selectedActor.click();
    await expect(page.getByText('Energinet DataHub A/S').first()).toBeVisible();
  });
});
