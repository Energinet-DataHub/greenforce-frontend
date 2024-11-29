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
import { APP_BASE_HREF } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { browserConfigurationProviders } from './gf-browser-configuration.provider';

describe('browserConfigurationProviders', () => {
  it('APP_BASE_HREF is not provided when the BrowserConfigurationProviders are missing', () => {
    const actualAppBaseHref = TestBed.inject(APP_BASE_HREF, null, {});
    expect(actualAppBaseHref).toBeNull();
  });

  it('APP_BASE_HREF is provided', () => {
    TestBed.configureTestingModule({
      providers: [browserConfigurationProviders],
    });

    const actualAppBaseHref = TestBed.inject(APP_BASE_HREF);
    expect(actualAppBaseHref).not.toBeNull();
  });
});
