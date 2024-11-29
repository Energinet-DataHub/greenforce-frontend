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
