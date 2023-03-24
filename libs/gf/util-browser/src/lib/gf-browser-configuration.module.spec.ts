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
import { APP_BASE_HREF } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import {
  GfBrowserConfigurationModule,
  GfBrowserConfigurationRootModule,
} from './gf-browser-configuration.module';

describe(GfBrowserConfigurationModule.name, () => {
  it('APP_BASE_HREF is not provided when the Angular module is not imported', () => {
    const actualAppBaseHref = TestBed.inject(APP_BASE_HREF, null);
    expect(actualAppBaseHref).toBeNull();
  });

  it('APP_BASE_HREF is provided when the Angular module is imported', () => {
    TestBed.configureTestingModule({
      imports: [GfBrowserConfigurationModule.forRoot()],
    });

    const actualAppBaseHref = TestBed.inject(APP_BASE_HREF, null);
    expect(actualAppBaseHref).not.toBeNull();
  });

  it('guards against direct import', () => {
    expect(GfBrowserConfigurationModule).toGuardAgainstDirectImport();
  });

  it('guards against being registered in multiple injectors', () => {
    expect(GfBrowserConfigurationRootModule).toGuardAgainstMultipleInjectorRegistration();
  });
});
