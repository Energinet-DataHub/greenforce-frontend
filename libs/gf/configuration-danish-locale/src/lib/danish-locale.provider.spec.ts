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
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { danishLocaleCode } from './danish-locale-code';

import { danishLocaleProvider } from './danish-locale.provider';

describe('danishLocaleProvider', () => {
  it('when not provided, default application locale is used', () => {
    const americanEnglishLocaleCode = 'en-US';

    TestBed.configureTestingModule({});
    const locale = TestBed.inject(LOCALE_ID);

    expect(locale).toBe(americanEnglishLocaleCode);
  });

  it('when provided, Danish is registered as the application locale', () => {
    TestBed.configureTestingModule({
      providers: [danishLocaleProvider],
    });
    const locale = TestBed.inject(LOCALE_ID);

    expect(locale).toBe(danishLocaleCode);
  });
});
