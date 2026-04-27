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

    // Close the auto-opening "New search" dialog first; it is rendered on top of the page
    // shell and its backdrop blocks visibility checks on elements underneath. Escape works
    // reliably; the Watt modal close button's aria-label sits on the <watt-button> wrapper,
    // so a role query for the inner native button does not match.
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 15_000 });
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();

    await expect(
      page.getByRole('heading', { name: /Fremsøg forretningsbeskeder/i })
    ).toBeVisible();

    const selectedActor = page.getByTestId('selectedMarketParticipant');
    await expect(selectedActor).toBeVisible({ timeout: 10_000 });

    // Clicking the trigger opens the dropup that lists every market participant the user has
    // access to. The actual entries differ between the mocked backend and live envs, so we
    // assert on the container surfacing rather than a specific organization name.
    await selectedActor.click();
    await expect(page.getByTestId('marketParticipantsDropup')).toBeVisible();
  });
});
