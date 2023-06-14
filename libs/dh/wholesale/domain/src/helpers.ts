import type { FormControl } from '@angular/forms';

export type MapQueryVariablesToFormControls<T> = {
  [P in keyof T]: FormControl<NonNullable<T[P]> | null>;
};
