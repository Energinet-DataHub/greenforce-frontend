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
import { FormControl } from '@angular/forms';
import { nextHourOrLaterValidator } from './next-hour-or-later-validator';

describe('nextHourOrLaterValidator', () => {
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl('', nextHourOrLaterValidator());
  });

  it('should return null if the control value is empty', () => {
    control.setValue('');

    expect(control.valid).toBe(true);
  });

  it('should return null if the control value is at least one hour in the future', () => {
    const nextHour = new Date();
    nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);

    control.setValue(nextHour.toISOString());

    expect(control.valid).toBe(true);
  });

  it('should set validation errors if the control value is less than one hour in the future', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 1000 * 60 * 59);

    control.setValue(past.toISOString());

    expect(control.valid).toBe(false);
    expect(control.hasError('nextHourOrLater')).toBe(true);
  });

  it('should not validate disabled controls', () => {
    control.disable();
    expect(control.errors).toBe(null);
  });
});
