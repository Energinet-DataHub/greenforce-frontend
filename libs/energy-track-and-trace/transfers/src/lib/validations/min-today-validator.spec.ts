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
import { minTodayValidator } from './min-today-validator';

describe('minTodayValidator', () => {
  let formGroup: FormGroup | null = null;

  beforeEach(() => {
    formGroup = new FormGroup({
      date: new FormControl('', minTodayValidator()),
    });
  });

  it('should return null if the control value is empty', () => {
    if (formGroup) {
      formGroup.patchValue({
        date: '',
      });

      expect(formGroup.get('date')?.valid).toBe(true);
    }
  });

  it('should return null if the control date is today', () => {
    if (formGroup) {
      const today = new Date();
      formGroup.patchValue({
        date: today,
      });

      expect(formGroup.get('date')?.valid).toBe(true);
    }
  });

  it('should return null if the control date is in the future', () => {
    if (formGroup) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      formGroup.patchValue({
        date: tomorrow,
      });

      expect(formGroup.get('date')?.valid).toBe(true);
    }
  });

  it('should return an error if the control date is before today', () => {
    if (formGroup) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      formGroup.patchValue({
        date: yesterday,
      });

      expect(formGroup.get('date')?.hasError('minToday')).toBe(true);
    }
  });
});
