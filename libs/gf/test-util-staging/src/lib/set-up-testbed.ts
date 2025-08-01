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
import {
  ComponentFixtureAutoDetect,
  getTestBed,
  TestBed,
  TestModuleMetadata,
} from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { browserConfigurationProviders } from '@energinet-datahub/gf/util-browser';

import { gfAngularMaterialTestingProviders } from './angular-material/gf-angular-material-testing.module';

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 */
import 'zone.js/plugins/zone-error';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';

function patchTestbed(): void {
  const isUnpatched = testbed.configureTestingModule === realConfigureTestingModule;

  if (isUnpatched) {
    testbed.configureTestingModule = (moduleDef: TestModuleMetadata): TestBed => {
      realConfigureTestingModule.call(testbed, {
        ...moduleDef,
        imports: [
          MatIconTestingModule,
          NoopAnimationsModule,
          RouterTestingModule,
          ...(moduleDef.imports ?? []),
        ],
        providers: [
          // Use automatic change detection in tests
          { provide: ComponentFixtureAutoDetect, useValue: true },
          ...(moduleDef.providers ?? []),
          browserConfigurationProviders,
          gfAngularMaterialTestingProviders,
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
 * Automatically import testing Angular modules for Angular Material.
 *
 *
 */
export function setUpTestbed(): void {
  testbed.resetTestEnvironment();
  testbed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
    teardown: {
      destroyAfterEach: true,
    },
  });

  patchTestbed();
}

const testbed = getTestBed();
const realConfigureTestingModule = getTestBed().configureTestingModule;
