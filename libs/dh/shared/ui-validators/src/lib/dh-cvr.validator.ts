import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dhCvrValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === '') return null;
    return !isValidDanishOrganizationNumber(control.value) ? { invalidCvrNumber: true } : null;
  };
}

/**
 * This function first removes any non-digit characters from the string and converts the remaining characters to numbers. It then checks if the length of the number is 8. If not, it returns false. It then calculates the check digit and compares it to the expected check digit. If they match, it returns true; otherwise, it returns false.
 * @param cvr
 * @returns boolean
 */
function isValidDanishOrganizationNumber(cvr: string) {
  const MOD_11_WEIGHTS = [2, 7, 6, 5, 4, 3, 2];
  const digits = cvr.replace(/\D/g, '').split('').map(Number);

  if (digits.length !== 8) return false;

  const serial = digits.slice(0, 7);
  const expectedCheckDigit = digits[digits.length - 1];

  const weightedSerials = serial.map((digit, index) => digit * MOD_11_WEIGHTS[index]);
  const mod = weightedSerials.reduce((a, b) => a + b, 0) % 11;
  const actualCheckDigit = mod === 0 ? 0 : 11 - mod;

  return actualCheckDigit === expectedCheckDigit;
}
