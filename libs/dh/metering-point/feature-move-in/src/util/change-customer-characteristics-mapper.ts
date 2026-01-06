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
import { CustomerCharacteristicsFormType } from '../types';
import {
  ChangeCustomerCharacteristicsBusinessReason,
  ChangeCustomerCharacteristicsInput,
  UsagePointLocationV1Input,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { FormGroup } from '@angular/forms';

export function mapChangeCustomerCharacteristicsFormToRequest(
  form: FormGroup<CustomerCharacteristicsFormType>,
  meteringPointId: string,
  businessReason: ChangeCustomerCharacteristicsBusinessReason,
  startDate: Date,
  electricalHeating: boolean,
  isBusinessCustomer: boolean
): ChangeCustomerCharacteristicsInput {
  const usagePointLocations: UsagePointLocationV1Input[] = [
    { addressType: 'LEGAL', ...form.controls.legalAddressDetails.value },
    { addressType: 'TECHNICAL', ...form.controls.technicalAddressDetails.value },
  ];

  if (isBusinessCustomer) {
    const controls = form.controls.businessCustomerDetails.controls;
    const firstCustomerName = controls.companyName.value;
    const firstCustomerCvrOrCpr = controls.cvr.value;
    const protectedName = controls.nameProtection.value;
    const secondCustomerCpr = null;
    const secondCustomerName = null;
    return {
      meteringPointId,
      businessReason,
      startDate,
      firstCustomerCvrOrCpr,
      firstCustomerName,
      secondCustomerCpr,
      secondCustomerName,
      protectedName,
      electricalHeating,
      usagePointLocations,
    };
  } else {
    const controls = form.controls.privateCustomerDetails.controls;
    const firstCustomerName = controls.customerName1.value;
    const firstCustomerCvrOrCpr = controls.cpr1.value;
    const protectedName = controls.nameProtection.value;
    const secondCustomerCpr = controls.cpr2.value;
    const secondCustomerName = controls.customerName2.value;
    return {
      meteringPointId,
      businessReason,
      startDate,
      firstCustomerCvrOrCpr,
      firstCustomerName,
      secondCustomerCpr,
      secondCustomerName,
      protectedName,
      electricalHeating,
      usagePointLocations,
    };
  }
}
