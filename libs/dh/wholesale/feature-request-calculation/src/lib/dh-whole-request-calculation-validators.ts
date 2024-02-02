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
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { WattRange } from '@energinet-datahub/watt/date';
import { differenceInDays, parseISO, subYears } from 'date-fns';

export const maxOneMonthDateRangeValidator =
  () =>
  (control: AbstractControl): ValidationErrors | null => {
    const range = control.value as WattRange<string>;

    if (!range) return null;

    const rangeInDays = differenceInDays(parseISO(range.end), parseISO(range.start));
    if (rangeInDays > 31) {
      return { maxOneMonthDateRange: true };
    }

    return null;
  };

export const startDateCannotBeAfterEndDateValidator =
  () =>
  (control: AbstractControl): ValidationErrors | null => {
    const range = control.value as WattRange<string>;

    if (!range) return null;

    const startDate = parseISO(range.start);
    const endDate = parseISO(range.end);

    if (startDate > endDate) {
      return { startDateCannotBeAfterEndDate: true };
    }

    return null;
  };

export const startDateCannotBeOlderThan3YearsValidator =
  () =>
  (control: AbstractControl): ValidationErrors | null => {
    const range = control.value as WattRange<string>;
    if (!range) return null;

    const startDate = parseISO(range.start);

    if (startDate < subYears(new Date(), 3)) {
      return { startDateCannotBeOlderThan3Years: true };
    }

    return null;
  };

export const startAndEndDateCannotBeInTheFutureValidator =
  () =>
  (control: AbstractControl): ValidationErrors | null => {
    const range = control.value as WattRange<string>;
    if (!range) return null;

    const endDate = parseISO(range.end);
    const startDate = parseISO(range.start);
    const now = new Date();

    if (endDate > now || startDate > now) {
      return { startAndEndDateCannotBeInTheFuture: true };
    }

    return null;
  };
