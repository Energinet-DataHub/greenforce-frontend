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
import { chromium, FullConfig } from '@playwright/test';
import 'dotenv/config';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function globalSetup(_config: FullConfig) {
  console.log('Authenticating...');

  const browser = await chromium.launch();
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  await page.goto('https://localhost:4200/');
  await page.click('text=email');
  await page.type('input[id="email"]', process.env.DH_E2E_USERNAME);
  await page.click('[placeholder="Password"]');
  await page.fill('[placeholder="Password"]', process.env.DH_E2E_PASSWORD);
  await page.click('button:has-text("Sign in")');
  await page.waitForURL('https://localhost:4200');

  // Save signed-in state to 'playwright-storage-state.json'.
  await page
    .context()
    .storageState({ path: 'apps/dh/e2e-dh/playwright-storage-state.json' });
  await browser.close();

  console.log('Authenticating completed...');
}

export default globalSetup;
