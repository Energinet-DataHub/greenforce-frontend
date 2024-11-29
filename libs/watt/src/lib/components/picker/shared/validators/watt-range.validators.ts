import { AbstractControl, ValidatorFn } from '@angular/forms';
import { WattDateRange } from '../../../../utils/date';

export class WattRangeValidators {
  static required: ValidatorFn = (control: AbstractControl<WattDateRange | null>) =>
    control.value?.start && control.value?.end ? null : { rangeRequired: true };

  static startRequired: ValidatorFn = (control: AbstractControl<WattDateRange | null>) =>
    control.value?.start ? null : { startOfRangeRequired: true };

  static endRequired: ValidatorFn = (control: AbstractControl<WattDateRange | null>) =>
    control.value?.end ? null : { endOfRangeRequired: true };
}
