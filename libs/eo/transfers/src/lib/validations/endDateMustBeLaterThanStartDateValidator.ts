import { AbstractControl, FormGroup } from "@angular/forms";
import { clearErrors, createTimestamp, setValidationErrors } from "./utils";

export function endDateMustBeLaterThanStartDateValidator() {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const formGroup = control as FormGroup;
    const {startDate, startDateTime, endDate, endDateTime, hasEndDate} = formGroup.controls;

    const shouldValidate = shouldValidateEndDate(hasEndDate, startDate, startDateTime, endDate, endDateTime);
    const startTimestamp = createTimestamp(startDate.value, parseInt(startDateTime.value));
    const endTimestamp = createTimestamp(endDate.value, parseInt(endDateTime.value));

    if (!shouldValidate || endTimestamp > startTimestamp) {
      clearErrors(endDate, endDateTime);
    } else {
      setValidationErrors('endDateMustBeLaterThanStartDate', endDate, endDateTime);
    }

    return null;
  };
}

function shouldValidateEndDate(hasEndDate: AbstractControl, ...fields: AbstractControl[]): boolean {
  return hasEndDate.value && !anyFieldIsMissing(...fields);
}

function anyFieldIsMissing(...fields: AbstractControl[]): boolean {
  return fields.some(field => !field.value);
}


