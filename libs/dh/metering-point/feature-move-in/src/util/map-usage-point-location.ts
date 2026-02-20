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
import { AddressDetailsValues, ContactDetailsValues } from '../types';
import {
  AddressTypeV1,
  UsagePointLocationV1Input,
} from '@energinet-datahub/dh/shared/domain/graphql';

export function mapUsagePointLocation(
  contactDetails: ContactDetailsValues,
  addressDetails: AddressDetailsValues,
  addressType: AddressTypeV1
): UsagePointLocationV1Input {
  const contact = contactDetails.contactGroup;
  const address = addressDetails.addressGroup;
  return {
    addressType,
    darReference: address?.darReference,
    postalCode: address?.postCode,
    poBox: address?.postBox,
    protectedAddress: addressDetails?.addressProtection ?? null,

    contactName: contact?.name,
    attention: contact?.attention,
    phone: contact?.phone,
    mobile: contact?.mobile,
    email: contact?.email,

    streetDetail: {
      streetName: address?.streetName,
      buildingNumber: address?.buildingNumber,
      streetCode: address?.streetCode,
      suiteNumber: address?.room,
      floor: address?.floor,
    },

    townDetail: {
      municipalityCode: address?.municipalityCode,
      additionalCityName: address?.citySubDivisionName,
      cityName: address?.cityName,
      country: address?.countryCode,
    },
  };
}
