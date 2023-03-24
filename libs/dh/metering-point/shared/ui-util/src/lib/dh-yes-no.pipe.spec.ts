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
import { createPipeHarness, SpectacularPipeHarness } from '@ngworker/spectacular';

import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { en as enTranslations } from '@energinet-datahub/dh/globalization/assets-localization';

import { pipeName, DhYesNoPipe, TValue } from './dh-yes-no.pipe';

describe(DhYesNoPipe.name, () => {
  beforeEach(() => {
    harness = createPipeHarness({
      pipe: DhYesNoPipe,
      pipeName,
      value: undefined,
      imports: [getTranslocoTestingModule()],
    });
  });

  let harness: SpectacularPipeHarness<TValue>;

  it('displays an empty string when value is `undefined`', () => {
    harness.value = undefined;

    expect(harness.text).toBe('');
  });

  it('displays an empty string when value is `null`', () => {
    harness.value = null;

    expect(harness.text).toBe('');
  });

  it('displays "No" when value is `false`', () => {
    harness.value = false;

    expect(harness.text).toBe(enTranslations.no);
  });

  it('displays "No" when value is an empty string', () => {
    harness.value = '';

    expect(harness.text).toBe(enTranslations.no);
  });

  it('displays "Yes" when value is `true`', () => {
    harness.value = true;

    expect(harness.text).toBe(enTranslations.yes);
  });
});
