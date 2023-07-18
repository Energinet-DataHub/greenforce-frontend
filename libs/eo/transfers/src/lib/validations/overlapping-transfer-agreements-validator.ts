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
import { AbstractControl, FormGroup } from '@angular/forms';
import { clearErrors, setValidationErrorsWithData } from './utils';
import { EoExistingTransferAgreement } from '../eo-transfers.store';

interface OverlappingTransferAgreementsValidatorError {
  start: EoExistingTransferAgreement | null;
  end: EoExistingTransferAgreement | null;
}

export function overlappingTransferAgreementsValidator(
  existingTransferAgreements: EoExistingTransferAgreement[]
) {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const formGroup = control as FormGroup;
    const { startDate, startDateTime, endDate, endDateTime, hasEndDate } = formGroup.controls;
    const controlStart = new Date(startDate.value).setHours(startDateTime.value, 0, 0, 0);
    const controlEnd = hasEndDate.value
      ? new Date(endDate.value).setHours(endDateTime.value, 0, 0, 0)
      : null;

    const isOverlapping: OverlappingTransferAgreementsValidatorError = validate(
      controlStart,
      controlEnd,
      existingTransferAgreements
    );

    if(!hasEndDate.value && isOverlapping.end) {
      setValidationErrorsWithData('overlapping', isOverlapping, hasEndDate);
      clearErrors('overlapping', startDate, startDateTime, endDate, endDateTime);
    } else if (isOverlapping.start) {
      setValidationErrorsWithData('overlapping', isOverlapping, startDate, startDateTime);
      clearErrors('overlapping', endDate, endDateTime, hasEndDate);
    } else if (isOverlapping.end) {
      setValidationErrorsWithData('overlapping', isOverlapping, endDate, endDateTime);
      clearErrors('overlapping', startDate, startDateTime);
    } else {
      clearErrors('overlapping', startDate, startDateTime, endDate, endDateTime, hasEndDate);
    }

    return null;
  };
}

function validate(
  controlStart: number,
  controlEnd: number | null,
  existingTransferAgreements: EoExistingTransferAgreement[]
): OverlappingTransferAgreementsValidatorError {
  const infinity = Infinity;

  for (const period of existingTransferAgreements) {
    const { startDate, endDate } = period;
    const effectiveEndDate = endDate ?? infinity;

    if (
      isOverlappingPeriod(
        { startDate: controlStart, endDate: controlEnd },
        { startDate, endDate: effectiveEndDate }
      )
    ) {
      return controlStart >= startDate && controlStart <= effectiveEndDate
        ? { start: period, end: null }
        : { start: null, end: period };
    }
  }

  return { start: null, end: null };
}

export function isOverlappingPeriod(
  period: { startDate: number; endDate: number | null },
  comparingPeriod: { startDate: number; endDate?: number | null }
): boolean {
  // Two periods overlap if (StartA <= EndB) and (EndA >= StartB)
  // If period end is undefined, we treat it as "infinity", so it always overlaps if the other period start is after its start
  return (
    period.startDate < (comparingPeriod.endDate || Infinity) &&
    (period.endDate || Infinity) > comparingPeriod.startDate
  );
}
