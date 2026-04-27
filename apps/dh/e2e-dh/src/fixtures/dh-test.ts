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
import { test as base } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

const SESSION_STORAGE_STATE = path.resolve(__dirname, '..', '..', '.auth', 'session.json');

type DhFixtures = {
  /**
   * When true (default), the fixture seeds the MSAL session captured by auth.setup.ts into
   * sessionStorage once at the start of the test. Subsequent navigations (including logout)
   * then behave naturally: the browser does NOT re-inject the tokens on every page load.
   * Set to false for specs that intentionally exercise the unauthenticated state.
   */
  authenticated: boolean;
};

export const test = base.extend<DhFixtures>({
  authenticated: [true, { option: true }],

  page: async ({ page, authenticated }, use) => {
    if (authenticated && fs.existsSync(SESSION_STORAGE_STATE)) {
      const serialized = fs.readFileSync(SESSION_STORAGE_STATE, 'utf-8');
      // page.evaluate needs an active document at the target origin, so visit '/' first.
      // The app will redirect to /login because no tokens are present yet; that's fine,
      // we are about to plant them.
      await page.goto('/');
      await page.evaluate((storage) => {
        const entries = JSON.parse(storage) as Record<string, string>;
        for (const [key, value] of Object.entries(entries)) {
          window.sessionStorage.setItem(key, value);
        }
      }, serialized);
      // When the test's next page.goto fires, the bundle re-boots and MSAL reads the
      // freshly-seeded tokens from sessionStorage. Logout later clears them and is NOT
      // overwritten on the post-logout redirect, so the unauthenticated state sticks.
    }
    await use(page);
  },
});

export { expect } from '@playwright/test';
