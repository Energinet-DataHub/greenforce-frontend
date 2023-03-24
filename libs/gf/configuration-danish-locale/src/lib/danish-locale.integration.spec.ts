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
import { Pipe, PipeTransform } from '@angular/core';
import { createPipeHarness } from '@ngworker/spectacular';
import { formatInTimeZone } from 'date-fns-tz';

import { DanishLocaleModule } from './danish-locale.module';
import { spaceToNonBreakingSpace } from './space-to-non-breaking-space';

const dummyPipeName = 'testDummy';

@Pipe({
  name: dummyPipeName,
})
class DummyPipe implements PipeTransform {
  transform<TValue>(value: TValue) {
    return value;
  }
}

describe('Danish locale', () => {
  it('configures the DecimalPipe', () => {
    const harness = createPipeHarness({
      imports: [DanishLocaleModule],
      pipe: DummyPipe,
      pipeName: dummyPipeName,
      template: "{{ value | number: '1.1' }}",
      value: 123456789,
    });

    expect(harness.text).toBe('123.456.789,0');
  });

  it('does NOT configure the CurrencyPipe', () => {
    /**
     * In Angular, the US Dollar is the default currency in the CurrencyPipe.
     *
     * Since Angular 9, a `DEFAULT_CURRENCY_CODE` dependency injection token is available.
     */
    const harness = createPipeHarness({
      imports: [DanishLocaleModule],
      pipe: DummyPipe,
      pipeName: dummyPipeName,
      template: "{{ value | currency: undefined: 'code' }}",
      value: 1234.56,
    });

    expect(harness.text).toEqual(spaceToNonBreakingSpace(`1.234,56 USD`));
  });

  it('configures the PercentPipe', () => {
    const harness = createPipeHarness({
      imports: [DanishLocaleModule],
      pipe: DummyPipe,
      pipeName: dummyPipeName,
      template: "{{ value | percent:'4.3-5' }}",
      value: 1.3495,
    });

    expect(harness.text).toBe(spaceToNonBreakingSpace(`0.134,950 %`));
  });

  it('configures the DatePipe', () => {
    const testDate = new Date('2020-05-24T08:00:00Z');

    const harness = createPipeHarness({
      imports: [DanishLocaleModule],
      pipe: DummyPipe,
      pipeName: dummyPipeName,
      template: "{{ value | date: 'medium' }}",
      value: testDate,
    });

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const hourAndMinutesInCurrentTimeZone = formatInTimeZone(testDate, timeZone, 'HH.mm');
    const dayInCurrentTimeZone = formatInTimeZone(testDate, timeZone, 'd');

    expect(harness.text).toBe(
      `${dayInCurrentTimeZone}. maj 2020 ${hourAndMinutesInCurrentTimeZone}.00`
    );
  });
});
