/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import { test, expect, Page } from '@playwright/test';

// Appearantly there are some issues with `paths` so we need to use absolute paths for now.
import { DisplayLanguage } from '../../../../../libs/dh/globalization/domain/src';

import * as appShell from '../support/app-shell.po';

export const getLanguagePicker = (language: DisplayLanguage, page: Page) => {
  return page.locator(`text=/\\s*${language}\\s*/i`);
};

test.describe('Language selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/metering-point/search');
  });

  test(`Given no language is selected
        Then Danish translations are displayed`, async ({ page }) => {
    test.slow();
    await page.waitForTimeout(5000);
    console.log('-------------------------------------');
    console.log('the application title is displayed');
    console.log(await page.innerHTML('dh-metering-point-search'));
    console.log('-------------------------------------');
    await expect(appShell.getTitle(page)).toHaveText('Målepunkter');
  });

  test(`When English is selected
      Then English translations are displayed`, async ({ page }) => {
    await getLanguagePicker(DisplayLanguage.English, page).click();
    await expect(appShell.getTitle(page)).toHaveText('Metering Points');
  });

  test(`Given English is selected
        When Danish is selected
        Then Danish translations are displayed`, async ({ page }) => {
    await getLanguagePicker(DisplayLanguage.English, page).click();
    await getLanguagePicker(DisplayLanguage.Danish, page).click();

    await expect(appShell.getTitle(page)).toHaveText('Målepunkter');
  });
});
