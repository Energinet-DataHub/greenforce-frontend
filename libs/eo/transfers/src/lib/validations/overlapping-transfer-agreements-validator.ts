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

import { EoExistingTransferAgreement } from '../existing-transfer-agreement';

interface OverlappingTransferAgreementsValidatorError {
  start: EoExistingTransferAgreement | null;
  end: EoExistingTransferAgreement | null;
}

export function overlappingTransferAgreementsValidator(
  existingTransferAgreements: EoExistingTransferAgreement[]
) {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const formGroup = control as FormGroup;
    const { startDate, endDate, hasEndDate } = formGroup.controls;

    const isOverlapping: OverlappingTransferAgreementsValidatorError = validate(
      startDate.value,
      endDate.value,
      existingTransferAgreements
    );

    if (!hasEndDate?.value && isOverlapping.end) {
      setValidationErrorsWithData('overlapping', isOverlapping, hasEndDate);
      clearErrors('overlapping', startDate, endDate);
    } else if (isOverlapping.start) {
      setValidationErrorsWithData('overlapping', isOverlapping, startDate);
      clearErrors('overlapping', endDate, hasEndDate);
    } else if (isOverlapping.end) {
      setValidationErrorsWithData('overlapping', isOverlapping, endDate);
      clearErrors('overlapping', startDate);
    } else {
      clearErrors('overlapping', startDate, endDate, hasEndDate);
    }

    return null;
  };
}

function validate(
  controlStart: number,
  controlEnd: number | null,
  existingTransferAgreements: EoExistingTransferAgreement[]
): OverlappingTransferAgreementsValidatorError {
  for (const period of existingTransferAgreements) {
    const { startDate, endDate } = period;
    const effectiveEndDate = endDate ?? Infinity;

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
  const endDateOfPeriod = period.endDate ?? Infinity;
  const endDateOfComparingPeriod = comparingPeriod.endDate ?? Infinity;

  return (
    period.startDate <= endDateOfComparingPeriod && endDateOfPeriod >= comparingPeriod.startDate
  );
}
