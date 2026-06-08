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
import { FormControl } from '@angular/forms';

import { dhMoveInCvrValidator } from '../src/validators/dh-move-in-cvr.validator';

describe('dhMoveInCvrValidator', () => {
  const validator = dhMoveInCvrValidator();

  it('allows test CVR 11111111 (checksum bypass)', () => {
    const control = new FormControl('11111111');
    expect(validator(control)).toBeNull();
  });

  it('allows test CVR 22222222 (checksum bypass)', () => {
    const control = new FormControl('22222222');
    expect(validator(control)).toBeNull();
  });

  it('allows a valid CVR number', () => {
    // 12345674: weighted sum = 106, mod 11 = 7, check digit = 4 ✓
    const control = new FormControl('12345674');
    expect(validator(control)).toBeNull();
  });

  it('allows an empty value', () => {
    const control = new FormControl('');
    expect(validator(control)).toBeNull();
  });

  it('rejects a CVR with an invalid checksum', () => {
    // 12345678: expected check digit is 4, not 8
    const control = new FormControl('12345678');
    expect(validator(control)).toEqual({ invalidCvrNumber: true });
  });

  it('rejects a CVR that is too short', () => {
    const control = new FormControl('1234567');
    expect(validator(control)).toEqual({ invalidCvrNumber: true });
  });

  it('rejects a CVR that is too long', () => {
    const control = new FormControl('123456789');
    expect(validator(control)).toEqual({ invalidCvrNumber: true });
  });
});
