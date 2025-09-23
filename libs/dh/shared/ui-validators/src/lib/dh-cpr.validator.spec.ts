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

  // it('should return null if control value is empty', () => {
  //   expect(dhCprValidator()(control)).toBeNull();
  // });

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
});
