/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import {
  validGsrnNumber,
  invalidGsrnNumber,
} from '@energinet-datahub/dh/shared/test-util-metering-point';

import { isValidGsrnNumber } from './is-valid-gsrn-number';

const _17Digits = validGsrnNumber.slice(0, -1);
const _18Digits = validGsrnNumber;
const _19Digits = invalidGsrnNumber;

describe(isValidGsrnNumber.prototype.name, () => {
  it('is valid', () => {
    expect(isValidGsrnNumber(_18Digits)).toBeTruthy();
  });

  describe('NOT valid', () => {
    it('invalidates an empty string', () => {
      const emptyString = '';

      expect(isValidGsrnNumber(emptyString)).toBeFalsy();
    });

    it('one digit below the valid GSRN number length', () => {
      expect(isValidGsrnNumber(_17Digits)).toBeFalsy();
    });

    it('one digit above the valid GSRN number length', () => {
      expect(isValidGsrnNumber(_19Digits)).toBeFalsy();
    });

    it('mixed value with letters and digits', () => {
      const lettersAndDigits = 'abc1234567890';

      expect(isValidGsrnNumber(lettersAndDigits)).toBeFalsy();
    });
  });
});
