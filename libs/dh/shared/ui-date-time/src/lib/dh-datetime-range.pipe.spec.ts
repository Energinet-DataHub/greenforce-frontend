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
import { DhDateTimeRangePipe, pipeName } from './dh-datetime-range.pipe';
import { createPipeHarness, SpectacularPipeHarness } from '@ngworker/spectacular';
import { TDateRangeValue } from './dh-format-danish-datetime';

describe(DhDateTimeRangePipe.name, () => {
  beforeEach(() => {
    harness = createPipeHarness({
      pipe: DhDateTimeRangePipe,
      pipeName: pipeName,
      value: undefined,
    });
  });

  let harness: SpectacularPipeHarness<TDateRangeValue>;

  describe('Validate date format', () => {
    test.each([
      [undefined, ''],
      [null, ''],
      [
        { start: '2021-01-01T00:00:00Z', end: '2021-01-01T00:00:00Z' },
        '01-01-2021 01:00 - 01-01-2021 01:00',
      ],
      [
        { start: '2021-12-31T23:00:00Z', end: '2022-01-01T00:00:00Z' },
        '01-01-2022 00:00 - 01-01-2022 01:00',
      ],
    ])('"%s" returns "%s" when formatted', async (value: TDateRangeValue, result: string) => {
      harness.value = value;

      await expect(harness.text).toBe(result);
    });
  });
});
