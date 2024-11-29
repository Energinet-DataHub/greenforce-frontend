import { Validators } from '@angular/forms';

export const dhMarketParticipantNameMaxLength = 150;

export const dhMarketParticipantNameMaxLengthValidatorFn = Validators.maxLength(
  dhMarketParticipantNameMaxLength
);
