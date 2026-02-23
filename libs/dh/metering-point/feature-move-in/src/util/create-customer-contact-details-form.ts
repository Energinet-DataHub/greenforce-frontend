//#region License
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//#endregion
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
