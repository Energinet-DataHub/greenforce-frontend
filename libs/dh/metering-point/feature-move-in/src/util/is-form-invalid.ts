import { FormGroup } from '@angular/forms';

export function isFormInvalid(group: FormGroup, path = ''): boolean {
  const invalid: string[] = [];
  for (const key of Object.keys(group.controls)) {
    const control = group.controls[key];
    const controlPath = path ? `${path}.${key}` : key;
    if (control instanceof FormGroup) {
      if (isFormInvalid(control, controlPath)) {
        return true;
      }
    } else if (control.invalid) {
      return true;
    }
  }
  return false;
}
