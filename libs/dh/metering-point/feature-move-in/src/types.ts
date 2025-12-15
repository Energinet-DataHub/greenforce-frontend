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
  GetMeteringPointByIdDocument,
  MoveInType,
} from '@energinet-datahub/dh/shared/domain/graphql';

export type StartMoveInFormType = {
  cutOffDate: FormControl<Date>;
  moveInType: FormControl<MoveInType | null>;
  customerType: FormControl<'private' | 'business'>;
  privateCustomer?: FormGroup<{
    name1: FormControl<string>;
    cpr1: FormControl<string>;
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
  name: FormControl<string>;
  title: FormControl<string>;
  phone: FormControl<string>;
  mobile: FormControl<string>;
  email: FormControl<string>;
};

export type AddressDetailsFormType = {
  addressSameAsMeteringPoint: FormControl<boolean>;
  addressGroup: FormGroup<AddressGroup>;
  nameAddressProtection: FormControl<boolean>;
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
  streetName: FormControl<string>;
  buildingNumber: FormControl<string>;
  floor: FormControl<string>;
  room: FormControl<string>;
  postCode: FormControl<string>;
  cityName: FormControl<string>;
  countryCode: FormControl<string>;
  streetCode: FormControl<string>;
  citySubDivisionName: FormControl<string>;
  postalDistrict: FormControl<string>;
  postBox: FormControl<string>;
  municipalityCode: FormControl<string>;
  darReference: FormControl<string>;
};

export type PrivateCustomerFormGroup = {
  customerName1: FormControl<string>;
  cpr1: FormControl<string>;
  customerName2: FormControl<string>;
  cpr2: FormControl<string>;
};

export type BusinessCustomerFormGroup = {
  companyName: FormControl<string>;
  cvr: FormControl<string>;
};

export type InstallationAddress = NonNullable<
  MeteringPointDetails['metadata']
>['installationAddress'];

export type MeteringPointDetails = ResultOf<typeof GetMeteringPointByIdDocument>['meteringPoint'];

type CommercialRelation = NonNullable<MeteringPointDetails['commercialRelation']>;
type ActiveEnergySupplyPeriod = NonNullable<CommercialRelation['activeEnergySupplyPeriod']>;

export type EnergySupplier = {
  gln?: CommercialRelation['energySupplier'];
  name?: NonNullable<CommercialRelation['energySupplierName']>['value'];
  validFrom?: ActiveEnergySupplyPeriod['validFrom'];
};

export type Contact = ActiveEnergySupplyPeriod['customers'][0];
