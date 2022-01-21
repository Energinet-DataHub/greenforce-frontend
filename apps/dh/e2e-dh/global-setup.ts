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
import { chromium, FullConfig } from '@playwright/test';
import 'dotenv/config';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function globalSetup(_config: FullConfig) {
  console.log('Authenticating...');

  const browser = await chromium.launch();
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    locale: 'en',
  });
  const page = await context.newPage();

  page.goto(process.env.BASE_URL);

  // Click [placeholder="Email Address"]
  await page.click('[placeholder="Email Address"]');
  // Fill [placeholder="Email Address"]
  await page.fill('[placeholder="Email Address"]', process.env.DH_E2E_USERNAME);
  // Click [placeholder="Password"]
  await page.click('[placeholder="Password"]');
  // Fill [placeholder="Password"]
  await page.fill('[placeholder="Password"]', process.env.DH_E2E_PASSWORD);

  // Click button:has-text("Sign in")
  await page.click('button:has-text("Sign in")');

  await page.waitForURL(process.env.BASE_URL);

  // Save signed-in state to 'playwright-storage-state.json'.
  await page
    .context()
    .storageState({ path: 'apps/dh/e2e-dh/playwright-storage-state.json' });
  await browser.close();

  console.log('Authenticating completed...');
}

export default globalSetup;
