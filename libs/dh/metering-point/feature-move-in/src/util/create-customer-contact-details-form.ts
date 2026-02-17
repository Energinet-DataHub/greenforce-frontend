import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';
import { Contact, ContactDetailsFormType, Customer } from '../types';
import { FormGroup, Validators } from '@angular/forms';
import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';

export function createCustomerContactDetailsForm(
  legalCustomer: Customer | undefined,
  contact: Contact
) {
  const nameSameAsCustomer = legalCustomer?.name === contact?.name;

  return new FormGroup<ContactDetailsFormType>({
    contactSameAsCustomer: dhMakeFormControl<boolean>(nameSameAsCustomer),
    contactGroup: new FormGroup({
      name: dhMakeFormControl<string>(
        {
          value: nameSameAsCustomer ? (legalCustomer?.name ?? '') : (contact?.name ?? ''),
          disabled: nameSameAsCustomer,
        },
        Validators.required
      ),
      phone: dhMakeFormControl<string>(contact?.phone ?? ''),
      mobile: dhMakeFormControl<string>(contact?.mobile ?? ''),
      attention: dhMakeFormControl<string>(contact?.attention ?? ''),
      email: dhMakeFormControl<string>(contact?.email ?? '', Validators.email),
    }),
  });
}
