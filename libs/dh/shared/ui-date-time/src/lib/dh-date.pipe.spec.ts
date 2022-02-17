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

  describe('Is able to hide and show time', () => {
    const dateToTestFormatWith = '2015-09-21T03:14:15Z';

    it('displays only date as default', () => {
      harness.value = dateToTestFormatWith;

      expect(harness.text).toBe('21-09-2015');
    });

    it('displays date and time', () => {
      harness.template = '{{ value | dhDate: true }}';
      harness.value = dateToTestFormatWith;

      expect(harness.text).toEqual(
        expect.stringMatching(/\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}/)
      );
    });

    it('respects the Danish timezone when formatting', () => {
      harness.template = '{{ value | dhDate: true }}';
      harness.value = dateToTestFormatWith;

      // We're at UTC+2 at the given date which is why it's 2 hours ahead of the initial date after formatting.
      expect(harness.text).toBe('21-09-2015 05:14:15');
    });
  });
});
