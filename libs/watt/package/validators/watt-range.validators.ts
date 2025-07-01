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
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { dayjs, WattDateRange } from '@energinet/watt/core/date';

export class WattRangeValidators {
  static required: ValidatorFn = (control: AbstractControl<WattDateRange | null>) =>
    control.value?.start && control.value?.end ? null : { rangeRequired: true };

  static startRequired: ValidatorFn = (control: AbstractControl<WattDateRange | null>) =>
    control.value?.start ? null : { startOfRangeRequired: true };

  static endRequired: ValidatorFn = (control: AbstractControl<WattDateRange | null>) =>
    control.value?.end ? null : { endOfRangeRequired: true };

  static maxDays =
    (maxDays: number): ValidatorFn =>
    ({ value }: AbstractControl<WattDateRange | null>) => {
      if (!value?.end || !value?.start) return null;
      // Since the date range does not include the last millisecond (ends at 23:59:59.999),
      // this condition checks for `maxDays` - 1 (as the diff is in whole days only).
      return dayjs(value.end).diff(value.start, 'days') > maxDays - 1 ? { maxDays: true } : null;
    };

  static maxMonths =
    (maxMonths: number): ValidatorFn =>
    ({ value }: AbstractControl<WattDateRange | null>) => {
      if (!value?.end || !value?.start) return null;
      // Since the date range does not include the last millisecond (ends at 23:59:59.999),
      // this condition checks for `maxMonths` - 1 (as the diff is in whole months only).
      return dayjs(value.end).diff(value.start, 'months') > maxMonths - 1
        ? { maxMonths: true }
        : null;
    };
}
