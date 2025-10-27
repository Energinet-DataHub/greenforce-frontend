//#region License
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
//#endregion
import { AbstractControl, FormControl } from '@angular/forms';

import { dhCprValidator } from './dh-cpr.validator';

describe('dhCprValidator', () => {
  const _9Digits = '271212123';
  // Note: This CPR number is randomly generated and does not correspond to a real individual.
  const _10Digits = '2712121230';
  const _11Digits = '27121212311';

  let control: AbstractControl;

  beforeEach(() => {
    control = new FormControl('');
  });

  it('should return null if control value is empty', () => {
    expect(dhCprValidator()(control)).toBeNull();
  });

  it('should return null if control value is exactly 10 digits', () => {
    control.setValue(_10Digits);
    expect(dhCprValidator()(control)).toBeNull();
  });

  it('should return containsLetters error if control value contains letters', () => {
    control.setValue('271212ABCD');
    expect(dhCprValidator()(control)).toEqual({ containsLetters: true });
  });

  it('should return containsDash error if control value contains a dash', () => {
    control.setValue('271212-1230');
    expect(dhCprValidator()(control)).toEqual({ containsDash: true });
  });

  it('should return invalidCprLength error if control value does not have exactly 10 digits', () => {
    control.setValue(_9Digits);
    expect(dhCprValidator()(control)).toEqual({ invalidCprLength: true });

    control.setValue(_11Digits);
    expect(dhCprValidator()(control)).toEqual({ invalidCprLength: true });
  });

  describe('date validation', () => {
    it('should return invalidDate error if day is invalid', () => {
      control.setValue('3212121234'); // 32nd day
      expect(dhCprValidator()(control)).toEqual({ invalidDate: true });

      control.setValue('0012121234'); // 00 day
      expect(dhCprValidator()(control)).toEqual({ invalidDate: true });
    });

    it('should return invalidDate error if month is invalid', () => {
      control.setValue('2513131234'); // 13th month
      expect(dhCprValidator()(control)).toEqual({ invalidDate: true });

      control.setValue('2500131234'); // 00 month
      expect(dhCprValidator()(control)).toEqual({ invalidDate: true });
    });

    it('should return invalidDate error for invalid day in specific months', () => {
      control.setValue('3104121234'); // 31st of April
      expect(dhCprValidator()(control)).toEqual({ invalidDate: true });

      control.setValue('2902131234'); // 29th of February in non-leap year
      expect(dhCprValidator()(control)).toEqual({ invalidDate: true });
    });

    it('should accept valid dates', () => {
      control.setValue('2512121234'); // 25th December
      expect(dhCprValidator()(control)).toBeNull();

      control.setValue('3110121234'); // 31st October
      expect(dhCprValidator()(control)).toBeNull();

      control.setValue('2902001234'); // 29th February in leap year 2000
      expect(dhCprValidator()(control)).toBeNull();
    });
  });
});
