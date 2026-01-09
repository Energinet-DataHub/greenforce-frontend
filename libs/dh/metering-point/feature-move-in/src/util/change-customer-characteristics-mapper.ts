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
import { FormGroup } from '@angular/forms';
import { CustomerCharacteristicsFormType } from '../types';
import {
  AddressTypeV1,
  ChangeCustomerCharacteristicsBusinessReason,
  ChangeCustomerCharacteristicsInput,
  UsagePointLocationV1Input,
} from '@energinet-datahub/dh/shared/domain/graphql';

function mapUsagePointLocation(
  addressDetails:
    | CustomerCharacteristicsFormType['legalAddressDetails']
    | CustomerCharacteristicsFormType['technicalAddressDetails'],
  contactDetails:
    | CustomerCharacteristicsFormType['legalContactDetails']
    | CustomerCharacteristicsFormType['technicalContactDetails'],
  addressType: AddressTypeV1
): UsagePointLocationV1Input {
  const address = addressDetails.getRawValue();
  const contact = contactDetails.controls.contactGroup.getRawValue();

  const group = address.addressGroup;

  return {
    addressType,
    darReference: group.darReference || null,
    postalCode: group.postCode || null,
    poBox: group.postBox || null,
    protectedAddress: address.addressProtection ?? null,

    contactName: contact.name || null,
    attention: contact.title || null,
    phone: contact.phone || null,
    mobile: contact.mobile || null,
    email: contact.email || null,

    streetDetail: {
      streetName: group.streetName || null,
      buildingNumber: group.buildingNumber || null,
      streetCode: group.streetCode || null,
      suiteNumber: group.room || null,
      floor: group.floor || null,
    },

    townDetail: {
      municipalityCode: group.municipalityCode || null,
      additionalCityName: group.citySubDivisionName || null,
      cityName: group.cityName || null,
      country: group.countryCode || null,
    },
  };
}

export function mapChangeCustomerCharacteristicsFormToRequest(
  form: FormGroup<CustomerCharacteristicsFormType>,
  meteringPointId: string,
  businessReason: ChangeCustomerCharacteristicsBusinessReason,
  startDate: Date,
  electricalHeating: boolean,
  isBusinessCustomer: boolean
): ChangeCustomerCharacteristicsInput {
  const usagePointLocations: UsagePointLocationV1Input[] = [
    mapUsagePointLocation(
      form.controls.legalAddressDetails,
      form.controls.legalContactDetails,
      AddressTypeV1.LEGAL
    ),
    mapUsagePointLocation(
      form.controls.technicalAddressDetails,
      form.controls.technicalContactDetails,
      AddressTypeV1.TECHNICAL
    ),
  ];

  if (isBusinessCustomer) {
    const controls = form.controls.businessCustomerDetails.controls;

    return {
      meteringPointId,
      businessReason,
      startDate,
      firstCustomerCpr: null,
      firstCustomerCvr: controls.cvr.value,
      firstCustomerName: controls.companyName.value,
      secondCustomerCpr: null,
      secondCustomerName: null,
      protectedName: controls.nameProtection.value,
      electricalHeating,
      usagePointLocations,
    };
  } else {
    const controls = form.controls.privateCustomerDetails.controls;

    return {
      meteringPointId,
      businessReason,
      startDate,
      firstCustomerCpr: controls.cpr1.value,
      firstCustomerCvr: null,
      firstCustomerName: controls.customerName1.value,
      secondCustomerCpr: controls.cpr2.value || null,
      secondCustomerName: controls.customerName2.value || null,
      protectedName: controls.nameProtection.value,
      electricalHeating,
      usagePointLocations,
    };
  }
}
