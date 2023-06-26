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
import { TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe, PercentPipe } from '@angular/common';
import { formatInTimeZone } from 'date-fns-tz';

import { spaceToNonBreakingSpace } from './space-to-non-breaking-space';
import { danishLocaleProvider } from './danish-locale.provider';
import { danishCurrencyProvider } from './danish-currency.provider';
import { danishLocaleInitializer } from './danish-locale.initializer';

describe('Danish locale', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [danishLocaleProvider, danishLocaleInitializer, danishCurrencyProvider],
    });
  });

  it('configures the DecimalPipe', () => {
    @Component({
      template: "{{ value | number: '1.1' }}",
      standalone: true,
      imports: [DecimalPipe],
    })
    class TestHostComponent {
      @Input()
      value = 123456789;
    }

    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.autoDetectChanges(true);
    const hostElement = hostFixture.nativeElement;

    expect(hostElement.textContent).toBe('123.456.789,0');
  });

  it('configures the CurrencyPipe', () => {
    @Component({
      template: "{{ value | currency: undefined: 'code' }}",
      standalone: true,
      imports: [CurrencyPipe],
    })
    class TestHostComponent {
      @Input()
      value = 1234.56;
    }

    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.autoDetectChanges(true);
    const hostElement = hostFixture.nativeElement;

    expect(hostElement.textContent).toEqual(spaceToNonBreakingSpace(`1.234,56 DKK`));
  });

  it('configures the PercentPipe', () => {
    @Component({
      template: "{{ value | percent:'4.3-5' }}",
      standalone: true,
      imports: [PercentPipe],
    })
    class TestHostComponent {
      @Input()
      value = 1.3495;
    }

    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.autoDetectChanges(true);
    const hostElement = hostFixture.nativeElement;

    expect(hostElement.textContent).toBe(spaceToNonBreakingSpace(`0.134,950 %`));
  });

  it('configures the DatePipe', () => {
    const testDate = new Date('2020-05-24T08:00:00Z');

    @Component({
      template: "{{ value | date: 'medium' }}",
      standalone: true,
      imports: [DatePipe],
    })
    class TestHostComponent {
      @Input()
      value = testDate;
    }

    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.autoDetectChanges(true);
    const hostElement = hostFixture.nativeElement;

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const hourAndMinutesInCurrentTimeZone = formatInTimeZone(testDate, timeZone, 'HH.mm');
    const dayInCurrentTimeZone = formatInTimeZone(testDate, timeZone, 'd');

    expect(hostElement.textContent).toBe(
      `${dayInCurrentTimeZone}. maj 2020 ${hourAndMinutesInCurrentTimeZone}.00`
    );
  });
});
