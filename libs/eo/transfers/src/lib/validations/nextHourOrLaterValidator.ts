import { AbstractControl, FormGroup } from "@angular/forms";
import { clearErrors, createTimestamp, setValidationErrors } from "./utils";

export function nextHourOrLaterValidator() {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const formGroup = control as FormGroup;
    const {startDate, startDateTime} = formGroup.controls;
    const nextHour = new Date().getHours() + 1;

    const validTimestamp = createTimestamp(new Date(), nextHour);
    const startTimestamp = createTimestamp(new Date(startDate.value), parseInt(startDateTime.value));

    if (startDate.errors || !startDate.value || startTimestamp < validTimestamp) {
      setValidationErrors('nextHourOrLater', startDate, startDateTime);
    } else {
      clearErrors('nextHourOrLater', startDate, startDateTime);
    }

    return null;
  };
}


