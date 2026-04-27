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
import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';
import * as path from 'node:path';

// Acceptance tests run against a deployed environment. dh3-environments sets BASE_URL to the
// frontend URL of the target stage (dev_002, preprod, etc.). Tests authenticate via the same
// B2C tenant, then navigate inside the deployed app.
const baseURL = process.env['BASE_URL'] ?? 'https://dev002.datahub3.dk';

const STORAGE_STATE = path.resolve(__dirname, '.auth/user.json');

export default defineConfig({
  // The preset configures fullyParallel, retries, and the html + (CI-only) blob reporter
  // pair with output paths under dist/.playwright/<project>/.
  ...nxE2EPreset(__filename, { testDir: './src/e2e', openHtmlReport: 'never' }),
  testIgnore: ['**/b2c-healthchecks.spec.ts'],
  use: {
    baseURL,
    locale: 'da-DK',
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  timeout: 30_000,
  expect: {
    timeout: 6_000,
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts$/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } },
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        storageState: STORAGE_STATE,
      },
      dependencies: ['setup'],
    },
  ],
  // No webServer: tests run against the deployed BASE_URL.
});
