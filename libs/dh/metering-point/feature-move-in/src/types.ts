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
import { type FormControl, type FormGroup } from '@angular/forms';
import type { ResultOf } from '@graphql-typed-document-node/core';

import {
  ChangeCustomerCharacteristicsInput,
  ChangeOfSupplierBusinessReason,
  GetMeteringPointByIdDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

export type StartMoveInFormType = {
  cutOffDate: FormControl<Date>;
  businessReason: FormControl<ChangeOfSupplierBusinessReason>;
  customerType: FormControl<'private' | 'business'>;
  privateCustomer?: FormGroup<{
    name: FormControl<string>;
    cpr: FormControl<string>;
  }>;
  businessCustomer?: FormGroup<{
    companyName: FormControl<string>;
    cvr: FormControl<string>;
    isForeignCompany: FormControl<boolean>;
  }>;
};

export type ContactDetailsFormType = {
  contactSameAsCustomer: FormControl<boolean>;
  contactGroup: FormGroup<ContactDetailsFormGroup>;
};

export type ContactDetailsFormGroup = {
  name: FormControl<string | null>;
  attention: FormControl<string | null>;
  phone: FormControl<string | null>;
  mobile: FormControl<string | null>;
  email: FormControl<string | null>;
};

export type AddressDetailsFormType = {
  addressSameAsInstallation: FormControl<boolean>;
  addressGroup: FormGroup<AddressGroup>;
  addressProtection: FormControl<boolean>;
};

export type AddressData = {
  streetName: string;
  buildingNumber: string;
  floor: string;
  room: string;
  postCode: string;
  cityName: string;
  countryCode: string;
  streetCode: string;
  citySubDivisionName: string;
  postalDistrict: string;
  postBox: string;
  municipalityCode: string;
  darReference: string;
};

export type AddressGroup = {
  streetName: FormControl<string | null>;
  buildingNumber: FormControl<string | null>;
  floor: FormControl<string | null>;
  room: FormControl<string | null>;
  postCode: FormControl<string | null>;
  cityName: FormControl<string | null>;
  countryCode: FormControl<string | null>;
  streetCode: FormControl<string | null>;
  citySubDivisionName: FormControl<string | null>;
  postBox: FormControl<string | null>;
  municipalityCode: FormControl<string | null>;
  darReference: FormControl<string | null>;
};

export type PrivateCustomerFormGroup = {
  customerName1: FormControl<string>;
  cpr1: FormControl<string>;
  customerName2: FormControl<string>;
  cpr2: FormControl<string>;
  nameProtection: FormControl<boolean>;
};

export type BusinessCustomerFormGroup = {
  companyName: FormControl<string>;
  cvr: FormControl<string>;
  nameProtection: FormControl<boolean>;
};

export type CustomerCharacteristicsFormType = {
  businessCustomerDetails: FormGroup<BusinessCustomerFormGroup>;
  privateCustomerDetails: FormGroup<PrivateCustomerFormGroup>;
  legalContactDetails: FormGroup<ContactDetailsFormType>;
  legalAddressDetails: FormGroup<AddressDetailsFormType>;
  technicalContactDetails: FormGroup<ContactDetailsFormType>;
  technicalAddressDetails: FormGroup<AddressDetailsFormType>;
};

export type MeteringPointDetails = ResultOf<typeof GetMeteringPointByIdDocument>['meteringPoint'];

type CommercialRelation = NonNullable<MeteringPointDetails['commercialRelation']>;
type ActiveEnergySupplyPeriod = NonNullable<CommercialRelation['activeEnergySupplyPeriod']>;
type Metadata = NonNullable<MeteringPointDetails['metadata']>;

export type InstallationAddress = Metadata['installationAddress'];

export type EnergySupplier = {
  gln?: CommercialRelation['energySupplier'];
  name?: NonNullable<CommercialRelation['energySupplierName']>['value'];
  validFrom?: ActiveEnergySupplyPeriod['validFrom'];
};

export type CustomerWithContacts = ActiveEnergySupplyPeriod['customers'][0];
export type Customer = Omit<CustomerWithContacts, 'legalContact' | 'technicalContact'>;
export type Contact =
  | CustomerWithContacts['legalContact']
  | CustomerWithContacts['technicalContact'];

export type UpdateCustomer = ChangeCustomerCharacteristicsInput;
export type Location = NonNullable<UpdateCustomer['usagePointLocations']>[0];
