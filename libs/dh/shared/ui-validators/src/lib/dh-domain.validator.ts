import { Validators } from '@angular/forms';

export const dhDomainValidator = Validators.pattern(/^([A-Za-z0-9-]{1,63}\.)+[A-Za-z]{2,6}$/);
