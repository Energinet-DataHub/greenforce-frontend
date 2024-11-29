import { AbstractControl, ValidatorFn } from '@angular/forms';

import { WattDateRange } from '../../../../utils/date';
import { WattRangeValidators } from './watt-range.validators';

interface RangeValue {
  value: WattDateRange;
}

describe('Range validators', () => {
  const fullRangeValue: RangeValue = { value: { start: '1', end: '10' } };
  const onlyWithStartValue: RangeValue = { value: { start: '1', end: '' } };
  const onlyWithEndValue: RangeValue = { value: { start: '', end: '10' } };

  const cases = [
    // required
    [
      '[required] should not return error, providing full range',
      WattRangeValidators.required,
      fullRangeValue,
      null,
    ],
    [
      '[required] should return error, providing only start of range',
      WattRangeValidators.required,
      onlyWithStartValue,
      { rangeRequired: true },
    ],
    [
      '[required] should return error, providing only end of range',
      WattRangeValidators.required,
      onlyWithEndValue,
      { rangeRequired: true },
    ],

    // startRequired
    [
      '[startRequired] should not return error, providing full range',
      WattRangeValidators.startRequired,
      fullRangeValue,
      null,
    ],
    [
      '[startRequired] should not return error, providing only start of range',
      WattRangeValidators.startRequired,
      onlyWithStartValue,
      null,
    ],
    [
      '[startRequired] should return error, providing only end of range',
      WattRangeValidators.startRequired,
      onlyWithEndValue,
      { startOfRangeRequired: true },
    ],

    // endRequired
    [
      '[endRequired] should not return error, providing full range',
      WattRangeValidators.endRequired,
      fullRangeValue,
      null,
    ],
    [
      '[endRequired] should return error, providing only start of range',
      WattRangeValidators.endRequired,
      onlyWithStartValue,
      { endOfRangeRequired: true },
    ],
    [
      '[endRequired] should not return error, providing only end of range',
      WattRangeValidators.endRequired,
      onlyWithEndValue,
      null,
    ],
  ];

  it.each<unknown[]>(cases)('%s', (_, validator, control, expected) => {
    const validationError = (validator as ValidatorFn)(control as AbstractControl);
    expect(validationError).toStrictEqual(expected);
  });
});
