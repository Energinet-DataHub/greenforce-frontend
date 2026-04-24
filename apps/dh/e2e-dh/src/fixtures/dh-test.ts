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
   * When true (default), the fixture replays the MSAL session captured by auth.setup.ts into
   * sessionStorage for every new page in the context. Set to false for specs that intentionally
   * exercise the unauthenticated state.
   */
  authenticated: boolean;
};

export const test = base.extend<DhFixtures>({
  authenticated: [true, { option: true }],

  context: async ({ context, authenticated }, use) => {
    if (authenticated && fs.existsSync(SESSION_STORAGE_STATE)) {
      const serialized = fs.readFileSync(SESSION_STORAGE_STATE, 'utf-8');
      await context.addInitScript((storage) => {
        if (window.location.hostname === 'localhost') {
          const entries = JSON.parse(storage) as Record<string, string>;
          for (const [key, value] of Object.entries(entries)) {
            window.sessionStorage.setItem(key, value);
          }
        }
      }, serialized);
    }
    await use(context);
  },
});

export { expect } from '@playwright/test';
