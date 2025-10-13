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

export type MoveInCustomerDetailsFormType = {
  cutOffDate: FormControl<Date>;
  moveInType: FormControl<MoveInType | null>;
  customerType: FormControl<'private' | 'business'>;
  privateCustomer?: FormGroup<{
    name1: FormControl<string>;
    cpr1: FormControl<string>;
    name2: FormControl<string>;
    cpr2: FormControl<string>;
  }>;
  businessCustomer?: FormGroup<{
    companyName: FormControl<string>;
    cvr: FormControl<string>;
    isForeignCompany: FormControl<boolean>;
  }>;
  isProtectedAddress: FormControl<boolean>;
};

export type MoveInContactDetailsFormType = {
  legalContactSameAsCustomer: FormControl<boolean>;
  legalContactName: FormControl<string>;
  legalContactTitle: FormControl<string>;
  legalContactPhone: FormControl<string>;
  legalContactMobile: FormControl<string>;
  legalContactEmail: FormControl<string>;
  technicalContactSameAsCustomer: FormControl<boolean>;
  technicalContactName: FormControl<string>;
  technicalContactTitle: FormControl<string>;
  technicalContactPhone: FormControl<string>;
  technicalContactMobile: FormControl<string>;
  technicalContactEmail: FormControl<string>;
};

export type MoveInAddressDetailsFormType = {
  legalAddressSameAsMeteringPoint: FormControl<boolean>;
  legalAddressGroup: FormGroup<AddressGroup>;
  legalNameAddressProtection: FormControl<boolean>;
  technicalAddressSameAsMeteringPoint: FormControl<boolean>;
  technicalAddressGroup: FormGroup<AddressGroup>;
  technicalNameAddressProtection: FormControl<boolean>;
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
  citySubdivisionName: string;
  postBox: string;
  municipalityCode: string;
  darReference: string;
};

type AddressGroup = {
  streetName: FormControl<string>;
  buildingNumber: FormControl<string>;
  floor: FormControl<string>;
  room: FormControl<string>;
  postCode: FormControl<string>;
  cityName: FormControl<string>;
  countryCode: FormControl<string>;
  streetCode: FormControl<string>;
  citySubdivisionName: FormControl<string>;
  postBox: FormControl<string>;
  municipalityCode: FormControl<string>;
  darReference: FormControl<string>;
};

export type MeteringPointDetails = ResultOf<typeof GetMeteringPointByIdDocument>['meteringPoint'];

export type InstallationAddress = NonNullable<
  MeteringPointDetails['metadata']
>['installationAddress'];
