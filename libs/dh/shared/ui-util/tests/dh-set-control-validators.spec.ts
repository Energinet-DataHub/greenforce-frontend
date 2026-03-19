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
import { FormControl, Validators } from '@angular/forms';

import { dhSetControlValidators } from '../src/dh-set-control-validators';

const minLengthValidator = Validators.minLength(3);

describe('dhSetControlValidators', () => {
  it('should add validators when active is true', () => {
    const control = new FormControl('');
    dhSetControlValidators(control, Validators.required, true);
    expect(control.hasValidator(Validators.required)).toBe(true);
  });

  it('should remove validators when active is false', () => {
    const control = new FormControl('', Validators.required);
    dhSetControlValidators(control, Validators.required, false);
    expect(control.hasValidator(Validators.required)).toBe(false);
  });

  it('should reset the control when active is false and reset option is true', () => {
    const control = new FormControl('some value');
    control.addValidators(Validators.required);
    dhSetControlValidators(control, Validators.required, false, { reset: true });
    expect(control.value).toBeNull();
    expect(control.hasValidator(Validators.required)).toBe(false);
  });

  it('should not reset the control when active is false and reset option is not set', () => {
    const control = new FormControl('some value', { nonNullable: true });
    control.addValidators(minLengthValidator);
    dhSetControlValidators(control, minLengthValidator, false);
    expect(control.value).toBe('some value');
  });

  it('should work with an array of validators', () => {
    const control = new FormControl('');
    const validators = [Validators.required, minLengthValidator];
    dhSetControlValidators(control, validators, true);
    expect(control.hasValidator(Validators.required)).toBe(true);
    expect(control.hasValidator(minLengthValidator)).toBe(true);

    dhSetControlValidators(control, validators, false);
    expect(control.hasValidator(Validators.required)).toBe(false);
    expect(control.hasValidator(minLengthValidator)).toBe(false);
  });

  it('should call updateValueAndValidity', () => {
    const control = new FormControl('');
    const spy = vi.spyOn(control, 'updateValueAndValidity');
    dhSetControlValidators(control, Validators.required, true);
    expect(spy).toHaveBeenCalled();
  });
});
