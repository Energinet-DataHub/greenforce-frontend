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
import type { Contact, Customer, InstallationAddress } from '../types';

/**
 * The fully resolved prefill values consumed by
 * `DhUpdateCustomerDataFormComponent`.
 *
 * The container component is responsible for choosing the data source
 * (metering point vs. temporary storage) and reducing it into this shape;
 * the form component only knows how to render and validate it.
 */
export interface CustomerDataPrefillVm {
  isBusinessCustomer: boolean;
  primary: {
    name: string;
    cvr: string;
    isProtectedName: boolean;
    /** `null` when the CPR is not yet masked (user must enter it). */
    customerId: string | null;
  };
  secondary: {
    name: string;
    isProtectedName: boolean;
    /** `null` when there is no secondary customer to mask. */
    customerId: string | null;
  };
  /** Used by `createCustomerContactDetailsForm` to detect "same as customer". */
  legalCustomer: Customer | undefined;
  legalContact: Contact;
  technicalContact: Contact;
  installationAddress: InstallationAddress | undefined;
}

