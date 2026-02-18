import { Contact, ContactDetailsFormType, Customer } from '../types';
import { FormGroup, Validators } from '@angular/forms';
import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';

export function createCustomerContactDetailsForm(
  legalCustomer: Customer | undefined,
  contact: Contact
) {
  const nameSameAsCustomer =
    legalCustomer?.name === contact?.name &&
    legalCustomer?.name !== undefined &&
    contact?.name !== undefined;

  return new FormGroup<ContactDetailsFormType>({
    contactSameAsCustomer: dhMakeFormControl<boolean>(nameSameAsCustomer),
    contactGroup: new FormGroup({
      name: dhMakeFormControl<string | null>(
        {
          value: nameSameAsCustomer ? legalCustomer?.name : (contact?.name ?? null),
          disabled: nameSameAsCustomer,
        },
        Validators.required
      ),
      phone: dhMakeFormControl<string | null>(contact?.phone),
      mobile: dhMakeFormControl<string | null>(contact?.mobile),
      attention: dhMakeFormControl<string | null>(contact?.attention),
      email: dhMakeFormControl<string | null>(contact?.email, Validators.email),
    }),
  });
}
