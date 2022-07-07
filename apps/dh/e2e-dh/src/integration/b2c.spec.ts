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

const environments = [
  {
    name: 'U001',
    url: 'https://jolly-sand-03f839703.azurestaticapps.net',
  },
  {
    name: 'U002',
    url: 'https://wonderful-field-057109603.1.azurestaticapps.net',
  },
  {
    name: 'T001',
    url: 'https://lively-river-0f22ad403.azurestaticapps.net',
  },
  {
    name: 'B001',
    url: 'https://blue-rock-05b7e5e03.azurestaticapps.net',
  },
  {
    name: 'B002',
    url: 'https://purple-forest-07e41fb03.azurestaticapps.net',
  },
];

environments.forEach((env) => {
  test(`[B2C Healthcheck] ${env.name} should have correct redirect_uri, after redirected to B2C login page`, async ({
    page,
  }) => {
    await page.goto(env.url).then((resp) => expect(resp?.status()).toBe(200));
    await page.waitForNavigation();
    expect(page.url()).toContain(`redirect_uri=${encodeURIComponent(env.url)}`);
  });

  test(`[B2C Healthcheck] ${env.name} should have "sign up" link, and redirect to "signup" user flow`, async ({
    page,
  }) => {
    await page.goto(env.url).then((resp) => expect(resp?.status()).toBe(200));
    await page.waitForNavigation();
    await page.locator('text=Sign up now').click();

    expect(page.url()).toContain(`signup`);
  });

  test(`[B2C Healthcheck] ${env.name} should have "forgot password" link, and redirect to "reset_password" user flow`, async ({
    page,
  }) => {
    await page.goto(env.url).then((resp) => expect(resp?.status()).toBe(200));
    await page.waitForNavigation();
    await page.locator('text=Reset password here').click();

    expect(page.url()).toContain(`reset_password`);
  });
});
