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
import { beforeEach } from 'vitest';

import {
  ComponentFixtureAutoDetect,
  getTestBed,
  TestBed,
  TestModuleMetadata,
} from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { browserConfigurationProviders } from '@energinet-datahub/gf/util-browser';

import { gfAngularMaterialTestingProviders } from './angular-material/gf-angular-material-testing.module';
import { gfRxAngularTestingProviders } from './rx-angular/gf-rx-angular-testing.providers';

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 */
import 'zone.js/plugins/zone-error';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { MatIconTestingModule } from '@angular/material/icon/testing';

/**
 * Set up localStorage mock for test environments where it may not be available.
 */
function setupLocalStorageMock(): void {
  if (typeof globalThis.localStorage === 'undefined' || !globalThis.localStorage?.getItem) {
    const store: Record<string, string> = {};
    globalThis.localStorage = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        Object.keys(store).forEach((key) => delete store[key]);
      },
      key: (index: number) => Object.keys(store)[index] ?? null,
      get length() {
        return Object.keys(store).length;
      },
    };
  }
}

/**
 * Disable CSS animations and transitions in tests by injecting a global style.
 * This is the modern replacement for provideNoopAnimations() which is deprecated in Angular 20.2.
 */
function disableAnimationsInTests(): void {
  const styleId = 'gf-test-disable-animations';
  if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-delay: 0ms !important;
        transition-duration: 0.01ms !important;
        transition-delay: 0ms !important;
      }
    `;
    document.head.appendChild(style);
  }
}

function patchTestbed(): void {
  const isUnpatched = testbed.configureTestingModule === realConfigureTestingModule;

  if (isUnpatched) {
    testbed.configureTestingModule = (moduleDef: TestModuleMetadata): TestBed => {
      realConfigureTestingModule.call(testbed, {
        ...moduleDef,
        imports: [MatIconTestingModule, ...(moduleDef.imports ?? [])],
        providers: [
          // Use automatic change detection in tests
          { provide: ComponentFixtureAutoDetect, useValue: true },
          ...(moduleDef.providers ?? []),
          browserConfigurationProviders,
          gfRxAngularTestingProviders,
          gfAngularMaterialTestingProviders,
          // Mark as NoopAnimations for Angular Material components that check this token
          { provide: ANIMATION_MODULE_TYPE, useValue: 'NoopAnimations' },
          provideRouter([]),
        ],
      });
      return testbed;
    };

    // Run at least once in case `TestBed.inject` is called without calling
    // `TestBed.configureTestingModule`
    beforeEach(() => {
      testbed.configureTestingModule({});
    });
  }
}

/**
 * This function must be called in all `test-setup.ts` files to ensure
 * consistent test runs.
 *
 * Use Angular testing module teardown.
 *
 * Use automatic change detection in tests
 *
 * Disable animations, provide `APP_BASE_HREF` at runtime, and isolate routing
 * from the DOM.
 *
 * Automatically import testing Angular modules for Angular Material and
 * RxAngular.
 *
 *
 */
export function setUpTestbed(): void {
  // Set up browser API mocks before initializing testbed
  setupLocalStorageMock();

  testbed.resetTestEnvironment();
  testbed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), {
    teardown: {
      destroyAfterEach: true,
    },
  });

  // Disable CSS animations in tests
  disableAnimationsInTests();

  patchTestbed();
}

const testbed = getTestBed();
const realConfigureTestingModule = getTestBed().configureTestingModule;
