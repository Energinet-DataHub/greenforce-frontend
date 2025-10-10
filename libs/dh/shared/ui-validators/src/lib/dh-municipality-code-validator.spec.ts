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

import { dhMunicipalityCodeValidator } from './dh-municipality-code-validator';

describe('dhMunicipalityCodeValidator', () => {
  const valid_3DigitCode = '123';
  const invalid_startsWithZero = '034';
  const invalid_2DigitCode = '12';
  const invalid_4DigitCode = '1234';

  let control: AbstractControl;

  beforeEach(() => {
    control = new FormControl('');
  });

  it('should return null if control value is empty', () => {
    expect(dhMunicipalityCodeValidator()(control)).toBeNull();
  });

  it('should return null if control value is null', () => {
    control.setValue(null);
    expect(dhMunicipalityCodeValidator()(control)).toBeNull();
  });

  it('should return null if control value is exactly 3 digits not starting with 0', () => {
    control.setValue(valid_3DigitCode);
    expect(dhMunicipalityCodeValidator()(control)).toBeNull();
  });

  it('should return startsWithZero error if control value starts with 0', () => {
    control.setValue(invalid_startsWithZero);
    expect(dhMunicipalityCodeValidator()(control)).toEqual({ startsWithZero: true });
  });

  it('should return containsLetters error if control value contains letters', () => {
    control.setValue('A23');
    expect(dhMunicipalityCodeValidator()(control)).toEqual({ containsLetters: true });
  });

  it('should return invalidMunicipalityCodeLength error if control value does not have exactly 3 digits', () => {
    control.setValue(invalid_2DigitCode);
    expect(dhMunicipalityCodeValidator()(control)).toEqual({ invalidMunicipalityCodeLength: true });

    control.setValue(invalid_4DigitCode);
    expect(dhMunicipalityCodeValidator()(control)).toEqual({ invalidMunicipalityCodeLength: true });
  });
});
