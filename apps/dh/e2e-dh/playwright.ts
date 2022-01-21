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
import { PlaywrightTestConfig } from '@playwright/test';
import 'dotenv/config';

// We use named export to beeing able to extend the config in other config files
export const config: PlaywrightTestConfig = {
  globalSetup: require.resolve('./global-setup'),
  use: {
    baseURL: process.env.BASE_URL,
    headless: false,
    ignoreHTTPSErrors: true,
    // Tell all tests to load signed-in state from 'playwright-storage-state.json'.
    storageState: 'apps/dh/e2e-dh/playwright-storage-state.json',
  },
};

// Default export is needed for Playwright to load the config.
export default config;
