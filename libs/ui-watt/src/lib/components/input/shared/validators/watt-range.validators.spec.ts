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
import { AbstractControl, ValidatorFn } from '@angular/forms';

import { WattRange } from '../watt-range';
import { WattRangeValidators } from './watt-range.validators';

interface RangeValue {
  value: WattRange;
}

describe('Range validators', () => {
  const fullRangeValue: RangeValue = { value: { start: '1', end: '10' } };
  const onlyWithStartValue: RangeValue = { value: { start: '1', end: '' } };
  const onlyWithEndValue: RangeValue = { value: { start: '', end: '10' } };

  const cases = [
    // required
    [
      '[required] should not return error, providing full range',
      WattRangeValidators.required(),
      fullRangeValue,
      null,
    ],
    [
      '[required] should return error, providing only start of range',
      WattRangeValidators.required(),
      onlyWithStartValue,
      { rangeRequired: true },
    ],
    [
      '[required] should return error, providing only end of range',
      WattRangeValidators.required(),
      onlyWithEndValue,
      { rangeRequired: true },
    ],

    // startRequired
    [
      '[startRequired] should not return error, providing full range',
      WattRangeValidators.startRequired(),
      fullRangeValue,
      null,
    ],
    [
      '[startRequired] should not return error, providing only start of range',
      WattRangeValidators.startRequired(),
      onlyWithStartValue,
      null,
    ],
    [
      '[startRequired] should return error, providing only end of range',
      WattRangeValidators.startRequired(),
      onlyWithEndValue,
      { startOfRangeRequired: true },
    ],

    // endRequired
    [
      '[endRequired] should not return error, providing full range',
      WattRangeValidators.endRequired(),
      fullRangeValue,
      null,
    ],
    [
      '[endRequired] should return error, providing only start of range',
      WattRangeValidators.endRequired(),
      onlyWithStartValue,
      { endOfRangeRequired: true },
    ],
    [
      '[endRequired] should not return error, providing only end of range',
      WattRangeValidators.endRequired(),
      onlyWithEndValue,
      null,
    ],
  ];

  it.each<unknown[]>(cases)('%s', (_, validator, control, expected) => {
    const validationError = (validator as ValidatorFn)(
      control as AbstractControl
    );
    expect(validationError).toStrictEqual(expected);
  });
});
