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
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { en as enTranslations } from '@energinet-datahub/dh/globalization/assets-localization';

import { DhYesNoPipe } from './dh-yes-no.pipe';
import { TestBed } from '@angular/core/testing';

describe(DhYesNoPipe, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule()],
    });
  });

  it('displays an empty string when value is `undefined`', () => {
    TestBed.runInInjectionContext(() => {
      expect(new DhYesNoPipe().transform(undefined)).toBe('');
    });
  });

  it('displays an empty string when value is `null`', () => {
    TestBed.runInInjectionContext(() => {
      expect(new DhYesNoPipe().transform(null)).toBe('');
    });
  });

  it('displays "No" when value is `false`', () => {
    TestBed.runInInjectionContext(() => {
      expect(new DhYesNoPipe().transform(false)).toBe(enTranslations.no);
    });
  });

  it('displays "No" when value is an empty string', () => {
    TestBed.runInInjectionContext(() => {
      expect(new DhYesNoPipe().transform('')).toBe(enTranslations.no);
    });
  });

  it('displays "Yes" when value is `true`', () => {
    TestBed.runInInjectionContext(() => {
      expect(new DhYesNoPipe().transform(true)).toBe(enTranslations.yes);
    });
  });
});
