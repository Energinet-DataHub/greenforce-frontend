import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// https://github.com/angular/angular/blob/2206efa55fc1de160333d62680f8893c47525335/packages/forms/src/validators.ts#L150C1-L151C200
const EMAIL_REGEXP =
  /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function emailsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').trim();

    if (value === '') {
      return null; // Empty value is valid
    }

    const emails = value.split(',').map((email) => email.trim());

    for (const email of emails) {
      if (!EMAIL_REGEXP.test(email)) {
        return { invalidEmail: true };
      }
    }

    return null; // All emails are valid
  };
}
