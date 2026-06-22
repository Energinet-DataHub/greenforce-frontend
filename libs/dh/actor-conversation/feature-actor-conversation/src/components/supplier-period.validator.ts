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
import { Signal } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

import { dayjs } from '@energinet/watt/core/date';

/** Validator for checking if a selected date falls within any supplier period */
export function supplierPeriodOnSelectedDateValidator(
  supplierPeriods: Signal<{ validFrom: Date; validTo: Date }[]>
): ValidatorFn {
  return (control: AbstractControl<Date | null>) => {
    const selectedDate = control.value;
    if (!selectedDate) return null;

    const selectedDay = dayjs(selectedDate);
    const hasPeriod = supplierPeriods().some((period) =>
      selectedDay.isBetween(period.validFrom, period.validTo, 'day', '[]')
    );

    return hasPeriod ? null : { noSupplierPeriodForSelectedDate: true };
  };
}

/** Validator for checking if a selected period falls within any supplier period */
export function supplierForSelectedPeriodValidator(
  supplierPeriods: Signal<{ validFrom: Date; validTo: Date }[]>
): ValidatorFn {
  return (
    control: AbstractControl<{ periodStart: Date | string | null; periodEnd: Date | string | null }>
  ) => {
    const { periodStart, periodEnd } = control.value;

    if (!periodStart) return null;

    const selectedDay = dayjs(periodStart);
    const supplierPeriod = supplierPeriods().find((period) =>
      selectedDay.isBetween(period.validFrom, period.validTo, 'day', '[]')
    );

    if (!periodEnd) return supplierPeriod ? null : { noSupplierPeriodForSelectedDates: true };

    const selectedEndDay = dayjs(periodEnd);
    const isEndWithinPeriod = supplierPeriod
      ? selectedEndDay.isBetween(selectedDay, supplierPeriod.validTo, 'day', '[]')
      : false;

    return isEndWithinPeriod ? null : { noSupplierPeriodForSelectedDates: true };
  };
}
