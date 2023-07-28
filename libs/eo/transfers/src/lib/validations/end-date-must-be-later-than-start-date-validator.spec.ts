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
import { FormGroup, FormControl } from '@angular/forms';
import { endDateMustBeLaterThanStartDateValidator } from './end-date-must-be-later-than-start-date-validator';

describe('endDateMustBeLaterThanStartDateValidator', () => {
  let formGroup: FormGroup | null = null;
  const startDate = new Date('2021-01-01');
  const endDate = new Date('2021-01-02');

  beforeEach(() => {
    formGroup = new FormGroup(
      {
        startDate: new FormControl(),
        endDate: new FormControl(),
      },
      { validators: endDateMustBeLaterThanStartDateValidator() }
    );
  });

  it('should return null if endDate is later than startDate', () => {
    if (formGroup) {
      formGroup.patchValue({
        startDate,
        endDate,
      });

      expect(formGroup.valid).toBe(true);
    }
  });

  it('should set validation errors if endDate is earlier than startDate', () => {
    if (formGroup) {
      formGroup.patchValue({
        startDate: endDate,
        endDate: startDate,
      });

      expect(formGroup.valid).toBe(false);
      expect(formGroup.get('endDate')?.hasError('endDateMustBeLaterThanStartDate')).toBe(true);
    }
  });

  it('should not set validation errors if either startDate or endDate is not set', () => {
    if (formGroup) {
      formGroup.patchValue({
        startDate,
      });

      expect(formGroup.valid).toBe(true);

      formGroup.patchValue({
        endDate,
      });

      expect(formGroup.valid).toBe(true);
    }
  });
});
