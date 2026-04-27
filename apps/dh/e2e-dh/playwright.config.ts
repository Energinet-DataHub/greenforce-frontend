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

import { workspaceRoot } from '@nx/devkit';
import * as path from 'node:path';

const baseURL = process.env['BASE_URL'] || 'https://localhost:4200';

const STORAGE_STATE = path.resolve(__dirname, '.auth/user.json');

/**
 * Shared base for both the local mocked-dev-server config (this file) and the acceptance
 * config (`playwright-acceptance-tests.config.ts`). The acceptance config spreads this and
 * overrides only what differs (baseURL, no webServer).
 */
export const baseE2EConfig = {
  // The preset already configures fullyParallel, retries, and the html + (CI-only) blob
  // reporters with output paths under dist/.playwright/<project>/. Those paths are declared
  // outputs of the e2e target, so Nx Cloud syncs them back from distributed agents to the
  // orchestrator where the merge-reports step runs.
  ...nxE2EPreset(__filename, { testDir: './src/e2e', openHtmlReport: 'never' }),
  testIgnore: ['**/b2c-healthchecks.spec.ts'],
  use: {
    locale: 'da-DK',
    // Honour prefers-reduced-motion in CSS and disable mat / cdk animations. Watt and CDK
    // both respect the media query, so transitions become instant and "element is not
    // stable" errors from in-flight animations disappear.
    reducedMotion: 'reduce' as const,
    ignoreHTTPSErrors: true,
    // The Angular dev server uses a self-signed cert. `ignoreHTTPSErrors` lets the browser
    // navigate, but Chrome applies stricter rules to service worker registration and refuses
    // to fetch mockServiceWorker.js over HTTPS with a cert it does not trust. Without this
    // flag MSW never starts, and API calls fall through to the dead BFF port. Harmless on
    // deployed envs where the cert is already trusted.
    launchOptions: {
      args: ['--ignore-certificate-errors'],
    },
    trace: 'on-first-retry' as const,
    video: 'retain-on-failure' as const,
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
};

export default defineConfig({
  ...baseE2EConfig,
  use: { ...baseE2EConfig.use, baseURL },
  webServer: {
    command: 'bun nx run app-dh:serve:mocked',
    url: baseURL,
    reuseExistingServer: !process.env['CI'],
    cwd: workspaceRoot,
    ignoreHTTPSErrors: true,
    timeout: 120_000,
  },
});
