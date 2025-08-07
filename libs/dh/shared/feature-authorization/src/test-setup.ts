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
import '@angular/compiler';
import 'zone.js';
import 'zone.js/testing';

// Add polyfill for structuredClone
if (!globalThis.structuredClone) {
  globalThis.structuredClone = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
  };
}

// Initialize Angular testing environment
beforeAll(async () => {
  const { getTestBed } = await import('@angular/core/testing');
  const { BrowserDynamicTestingModule, platformBrowserDynamicTesting } = await import(
    '@angular/platform-browser-dynamic/testing'
  );

  getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

  // Setup MSW - temporarily commented out due to Vitest compatibility issue
  // const { setupMSWServer } = await import('@energinet-datahub/gf/test-util-msw');
  // const { dhLocalApiEnvironment } = await import('@energinet-datahub/dh/shared/assets');
  // const { mocks } = await import('@energinet-datahub/dh/shared/data-access-mocks');

  // setupMSWServer(dhLocalApiEnvironment.apiBase, mocks);
});
