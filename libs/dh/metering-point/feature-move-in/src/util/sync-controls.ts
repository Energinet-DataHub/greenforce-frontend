import { AbstractControl } from '@angular/forms';

export function sync<C extends AbstractControl>(
  control: C,
  value: C['value'] | null | undefined,
  toggle: boolean
) {
  if (value != null) {
    control.patchValue(value);
    control.updateValueAndValidity();
  }
  if (toggle) {
    control.disable();
  } else {
    control.enable();
  }
}
