import { AbstractControl, ValidatorFn } from '@angular/forms';

export function dhUniqueMarketParticipantsValidator(): ValidatorFn {
  return (formGroup: AbstractControl) => {
    const discontinuedEntityControl = formGroup.get('discontinuedEntity');
    const survivingEntityControl = formGroup.get('survivingEntity');

    if (
      formGroup.untouched ||
      discontinuedEntityControl?.value === null ||
      survivingEntityControl?.value === null
    ) {
      return null;
    }

    discontinuedEntityControl?.setErrors(null);
    survivingEntityControl?.setErrors(null);

    if (discontinuedEntityControl?.value === survivingEntityControl?.value) {
      survivingEntityControl?.setErrors({ notUniqueMarketParticipants: true });
      discontinuedEntityControl?.setErrors({ notUniqueMarketParticipants: true });

      return { notUniqueMarketParticipants: true };
    }

    return null;
  };
}
