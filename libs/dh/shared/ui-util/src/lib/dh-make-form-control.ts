import { FormControl } from '@angular/forms';

/**
 * Helper function for creating form control with `nonNullable` based on value.
 */
export const dhMakeFormControl = <T>(value: T | null = null) =>
  new FormControl(value, { nonNullable: Boolean(value) });
