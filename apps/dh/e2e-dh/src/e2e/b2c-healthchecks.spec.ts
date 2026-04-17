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

test.describe.configure({ retries: 3 });

const environments = [
  {
    name: 'dev_001',
    url: 'https://dev.datahub3.dk/',
  },
  {
    name: 'dev_002',
    url: 'https://dev002.datahub3.dk/',
  },
  {
    name: 'dev_003',
    url: 'https://dev003.datahub3.dk/',
  },
  {
    name: 'test_001',
    url: 'https://test.datahub3.dk/',
  },
  {
    name: 'preprod',
    url: 'https://preprod.datahub3.dk/',
  },
  {
    name: 'prod',
    url: 'https://datahub3.dk/',
  },
];

for (const env of environments) {
  test(`[B2C Healthcheck] ${env.name}`, async ({ page, request }) => {
    // Should be able to reach the app
    const response = await request.get(env.url);
    expect(response.status()).toBe(200);

    await page.goto(env.url);

    await page.locator('watt-button').click();

    // Should have correct redirect_uri
    await expect(page).toHaveURL(new RegExp(`redirect_uri=${encodeURIComponent(env.url)}`), {
      timeout: 10_000,
    });
  });
}
