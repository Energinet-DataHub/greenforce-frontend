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
import '@analogjs/vitest-angular/setup-zone';
import '@testing-library/jest-dom/vitest';

import { beforeEach } from 'vitest';
import { getTestBed, ɵgetCleanupHook as getCleanupHook } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

// Note: This library cannot use setUpTestbed from gf-test-util-staging
// because gf-test-util-staging depends on gf-util-browser, which would create a circular dependency.

// Symbol used to detect already-initialized TestBed across setup-file re-evaluations
// (which happen per test file with isolate: false).
const INIT_MARKER = Symbol.for('gf-util-browser-testenv-init');

if (!(globalThis as Record<symbol, unknown>)[INIT_MARKER]) {
  (globalThis as Record<symbol, unknown>)[INIT_MARKER] = true;
  getTestBed().resetTestEnvironment();
  getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
}

// With isolate: false, Angular's module-level globalThis.afterEach(getCleanupHook(true))
// is only registered on the first file's root suite. clearCollectorContext() wipes it
// before each subsequent file.
//
// We put resetTestingModule() in beforeEach (not afterEach) so that zone.js microtasks
// from the previous test complete naturally before we destroy ApplicationRef — avoiding
// NG0406 warnings from CDK overlay's microtask-scheduled cleanup.
beforeEach(() => {
  getCleanupHook(true)();
});
