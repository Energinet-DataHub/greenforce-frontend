/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import {
  ComponentFixtureAutoDetect,
  getTestBed,
  TestModuleMetadata,
} from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { GfAngularMaterialTestingModule } from './angular-material/gf-angular-material-testing.module';
import { GfBrowserTestingModule } from './angular/gf-browser-testing.module';
import { GfRxAngularTestingModule } from './rx-angular/gf-rx-angular-testing.module';

function patchTestbed(): void {
  const isUnpatched =
    testbed.configureTestingModule === realConfigureTestingModule;

  if (isUnpatched) {
    testbed.configureTestingModule = (moduleDef: TestModuleMetadata): void => {
      realConfigureTestingModule.call(testbed, {
        ...moduleDef,
        imports: [
          GfBrowserTestingModule,
          GfAngularMaterialTestingModule,
          GfRxAngularTestingModule,
          ...(moduleDef.imports ?? []),
        ],
        providers: [
          // Use automatic change detection in tests
          { provide: ComponentFixtureAutoDetect, useValue: true },
          ...(moduleDef.providers ?? []),
        ],
      });
    };
  }
}

/**
 * Use Angular testing module teardown.
 *
 * Automatically import testing Angular modules for Angular Material and
 * RxAngular.
 */
export function setUpTestbed(): void {
  testbed.resetTestEnvironment();
  testbed.initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting(),
    {
      teardown: {
        destroyAfterEach: true,
      },
    }
  );

  patchTestbed();
}

const testbed = getTestBed();
const realConfigureTestingModule = getTestBed().configureTestingModule;
