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
  createPipeHarness,
  SpectacularPipeHarness,
} from '@ngworker/spectacular';

import { DhDatePipe, pipeName, TValue } from './dh-date.pipe';

describe(DhDatePipe, () => {
  beforeEach(() => {
    harness = createPipeHarness({
      pipe: DhDatePipe,
      pipeName: pipeName,
      value: undefined,
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

  describe('Summer Time', () => {
    it('displays a formatted date', () => {
      harness.value = '2021-06-30T22:00:00Z';

      expect(harness.text).toBe('01-07-2021');
    });
  });

  describe('Standard Time', () => {
    it('displays a formatted date', () => {
      harness.value = '2021-12-31T23:00:00Z';

      expect(harness.text).toBe('01-01-2022');
    });
  });
});
