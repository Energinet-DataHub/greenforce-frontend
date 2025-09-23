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

export type MoveInCustomerDetailsFormType = {
  cutOffDate: FormControl<Date>;
  moveInType: FormControl<string>;
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
  legalAddressSameAsMeteringPoint: FormControl<boolean>;
  legalAddressStreet: FormControl<string>;
  legalAddressNumber: FormControl<string>;
  legalAddressFloor: FormControl<string>;
  legalAddressDoor: FormControl<string>;
  legalAddressPostalCode: FormControl<string>;
  legalAddressCity: FormControl<string>;
  legalAddressCountry: FormControl<string>;
  legalAddressRoadCode: FormControl<string>;
  legalAddressPostalDistrict: FormControl<string>;
  legalAddressPostBox: FormControl<string>;
  legalAddressMunicipalityCode: FormControl<string>;
  legalAddressDarReference: FormControl<string>;
  legalNameAddressProtection: FormControl<boolean>;
  technicalContactSameAsCustomer: FormControl<boolean>;
  technicalContactName: FormControl<string>;
  technicalContactTitle: FormControl<string>;
  technicalContactPhone: FormControl<string>;
  technicalContactMobile: FormControl<string>;
  technicalContactEmail: FormControl<string>;
  technicalAddressSameAsMeteringPoint: FormControl<boolean>;
  technicalAddressStreet: FormControl<string>;
  technicalAddressNumber: FormControl<string>;
  technicalAddressFloor: FormControl<string>;
  technicalAddressDoor: FormControl<string>;
  technicalAddressPostalCode: FormControl<string>;
  technicalAddressCity: FormControl<string>;
  technicalAddressCountry: FormControl<string>;
  technicalAddressRoadCode: FormControl<string>;
  technicalAddressPostalDistrict: FormControl<string>;
  technicalAddressPostBox: FormControl<string>;
  technicalAddressMunicipalityCode: FormControl<string>;
  technicalAddressDarReference: FormControl<string>;
  technicalNameAddressProtection: FormControl<boolean>;
};

export enum MoveInType {
  Ordinary = 'E65',
  Secondary = 'D29',
}
