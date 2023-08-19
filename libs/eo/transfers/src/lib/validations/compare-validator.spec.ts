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
import { FormControl, FormGroup } from '@angular/forms';
import { compareValidator } from './compare-validator';

describe('compareValidator', () => {
  let formGroup: FormGroup | null = null;
  const compareValue = '11223344';

  beforeEach(() => {
    formGroup = new FormGroup({
      receiver: new FormControl('', compareValidator(compareValue, 'compare')),
    });
  });

  it('should return null if the control value matches the compare value', () => {
    if (formGroup) {
      formGroup.patchValue({
        receiver: compareValue.split('').reverse().join(''),
      });

      const control = formGroup.get('receiver');
      expect(control).not.toBeNull();
      expect(control?.hasError('compare')).toBe(false);
    }
  });

  it('should return an error if the control value does not match the compare value', () => {
    if (formGroup) {
      formGroup.patchValue({
        receiver: compareValue,
      });

      const control = formGroup.get('receiver');
      expect(control).not.toBeNull();
      expect(control?.hasError('compare')).toBe(true);
    }
  });
});
