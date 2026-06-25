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
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { dayjs } from '@energinet/watt/date';

const danishTimeZone = 'Europe/Copenhagen';

// True when `value` is a calendar day before today in the Danish timezone.
// Compared in Europe/Copenhagen so the boundary is stable regardless of the
// runtime timezone. Pair with a datepicker `dateFilter` to disable past days.
export const isDateBeforeToday = (value: Date | string | null | undefined): boolean => {
  if (!value) return false;

  const picked = dayjs(value).tz(danishTimeZone).startOf('day');
  const today = dayjs().tz(danishTimeZone).startOf('day');

  return picked.isBefore(today);
};

/** Rejects a date earlier than today (Danish day). Error key: `dateInThePast`. */
export function dhDateNotInThePastValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    isDateBeforeToday(control.value) ? { dateInThePast: true } : null;
}
