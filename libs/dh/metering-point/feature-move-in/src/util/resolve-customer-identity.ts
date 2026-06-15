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
import { CustomerIdentity, FormValues } from '../types';

export function resolveCustomerIdentity(
  values: FormValues,
  isBusinessCustomer: boolean
): CustomerIdentity {
  if (isBusinessCustomer) {
    return {
      firstCustomerName: values.businessCustomerDetails.companyName || undefined,
      firstCustomerCvr: values.businessCustomerDetails.cvr || undefined,
      firstCustomerCpr: undefined,
      secondCustomerCpr: undefined,
      secondCustomerName: undefined,
    };
  }

  const { cpr1, cpr2, customerName1, customerName2 } = values.privateCustomerDetails;

  // Trim whitespace and treat empty strings as undefined
  const name2Trimmed = (customerName2 ?? '').trim();

  // Only send secondCustomerName if it's not empty
  // Only send secondCustomerCpr if secondCustomerName is not empty
  // This ensures we can clear a secondary customer by sending both as undefined
  const secondCustomerName = name2Trimmed || undefined;
  const secondCustomerCpr = secondCustomerName ? cpr2 || undefined : undefined;

  return {
    firstCustomerName: customerName1 || undefined,
    firstCustomerCpr: cpr1 || undefined,
    secondCustomerName,
    secondCustomerCpr,
    firstCustomerCvr: undefined,
  };
}

export function resolveNameProtection(values: FormValues, isBusinessCustomer: boolean): boolean {
  return isBusinessCustomer
    ? values.businessCustomerDetails.nameProtection
    : values.privateCustomerDetails.nameProtection;
}
