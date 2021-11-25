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
  validMeteringPointId,
  invalidMeteringPointId,
} from '@energinet-datahub/dh/shared/test-util-metering-point';

import { isValidMeteringPointId } from './is-valid-metering-point-id';

const _17Digits = validMeteringPointId.slice(0, -1);
const _18Digits = validMeteringPointId;
const _19Digits = invalidMeteringPointId;

describe(isValidMeteringPointId.prototype.name, () => {
  it('is valid', () => {
    expect(isValidMeteringPointId(_18Digits)).toBeTruthy();
  });

  describe('NOT valid', () => {
    it('invalidates an empty string', () => {
      const emptyString = '';

      expect(isValidMeteringPointId(emptyString)).toBeFalsy();
    });

    it('one digit below valid metering point id length', () => {
      expect(isValidMeteringPointId(_17Digits)).toBeFalsy();
    });

    it('one digit above valid metering point id length', () => {
      expect(isValidMeteringPointId(_19Digits)).toBeFalsy();
    });

    it('mixed value with letters and digits', () => {
      const lettersAndDigits = 'abc1234567890';

      expect(isValidMeteringPointId(lettersAndDigits)).toBeFalsy();
    });
  });
});
