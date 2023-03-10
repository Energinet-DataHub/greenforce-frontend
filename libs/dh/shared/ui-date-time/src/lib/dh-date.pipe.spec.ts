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
import { DhDatePipe, pipeName } from './dh-date.pipe';
import { TStringValue } from './dh-format-danish-datetime';
import { createPipeHarness, SpectacularPipeHarness } from '@ngworker/spectacular';

describe(DhDatePipe, () => {
  beforeEach(() => {
    harness = createPipeHarness({
      pipe: DhDatePipe,
      pipeName: pipeName,
      value: undefined,
    });
  });

  let harness: SpectacularPipeHarness<TStringValue>;

  describe('Validate date format', () => {
    test.each([
      [undefined, ''],
      [null, ''],
      ['2021-12-31T23:00:00Z', '01-01-2022'], // Standard / Winter time
      ['2021-06-30T22:00:00Z', '01-07-2021'], // Summer time
    ])(
      '"%s" returns "%s" when formatted',
      async (value: undefined | null | string, result: string) => {
        harness.value = value;

        await expect(harness.text).toBe(result);
      }
    );
  });
});
