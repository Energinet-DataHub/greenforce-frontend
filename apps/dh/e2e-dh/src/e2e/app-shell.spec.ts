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
  const initialUrl = '/message-archive';

  test('shows the selected actor and reveals organization name on click', async ({ page }) => {
    await page.goto(initialUrl);

    await expect(page.getByRole('heading', { name: /Fremsøg forretningsbeskeder/i })).toBeVisible();

    // The "New search" dialog auto-opens on /message-archive; close it via Escape before
    // interacting with elements behind the backdrop. Watt's modal close button has its
    // aria-label on the <watt-button> wrapper instead of the inner native button, so role
    // queries with name=/close/i do not match. Escape avoids the brittleness entirely.
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();

    const selectedActor = page.getByTestId('selectedMarketParticipant');
    await expect(selectedActor).toBeVisible({ timeout: 10_000 });

    await selectedActor.click();
    await expect(page.getByText('Energinet DataHub A/S').first()).toBeVisible();
  });
});
