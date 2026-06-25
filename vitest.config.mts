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
/// <reference types="vitest" />
/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';

// Root Vitest config — replaces the legacy `vitest.workspace.ts` file form,
// which was deprecated in Vitest 3.2 and removed in Vitest 4.
//
// Per-project Vitest config lives in each project's own vite/vitest config
// file. Only the entries below participate as Vitest "projects" (root-level
// workspace runs); other libs (e.g. dh/gf implicit libs) are intentionally
// excluded and must be run via `nx run <lib>:test`. See the comments in
// libs/dh/vite.config.mts and libs/gf/vite.config.mts for the rationale.
export default defineConfig({
  test: {
    projects: [
      // App — has its own MSW polyfill + resolve.alias; kept as-is
      'apps/dh/app-dh/vite.config.mts',
      // watt — buildable ng-packagr library with its own vitest config
      'libs/watt/vitest.config.mts',
    ],
  },
});
