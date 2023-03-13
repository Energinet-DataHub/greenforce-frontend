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
import { test, expect } from '@playwright/test';

// Appearantly there are some issues with `paths` so we need to use absolute paths for now.
import { da as daTranslations } from '@energinet-datahub/dh/globalization/assets-localization';

import * as appShell from '../support/app-shell.po';

test.describe('Application shell', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/metering-point/search');
  });

  test('the application title is displayed', async ({ page }) => {
    test.slow();
    await page.waitForTimeout(5000);
    await expect(appShell.getTitle(page)).toHaveText(daTranslations.meteringPoint.search.title);
  });
});
