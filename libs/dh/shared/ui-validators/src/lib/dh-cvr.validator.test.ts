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
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { dhCvrValidator } from './dh-cvr.validator';

describe('dhCvrValidator', () => {
  let control: AbstractControl;

  beforeEach(() => {
    control = new FormControl('');
  });

  it('should return null if control value is empty', () => {
    expect(dhCvrValidator()(control)).toBeNull();
  });

  it('should return null if control value is a valid Danish organization number', () => {
    control.setValue('28980671');
    expect(dhCvrValidator()(control)).toBeNull();
  });

  it('should return an error object if control value is an invalid Danish organization number', () => {
    control.setValue('12345679');
    const expectedError: ValidationErrors = { invalidCvrNumber: true };
    expect(dhCvrValidator()(control)).toEqual(expectedError);
  });
});
