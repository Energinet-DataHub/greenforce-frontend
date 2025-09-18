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
import { FormControl, type FormGroup } from '@angular/forms';
import { GetMeteringPointByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import type { ResultOf } from '@graphql-typed-document-node/core';

export type MeteringPointDetails = ResultOf<typeof GetMeteringPointByIdDocument>['meteringPoint'];

type CommercialRelation = NonNullable<MeteringPointDetails['commercialRelation']>;
type ActiveEnergySupplyPeriod = NonNullable<CommercialRelation['activeEnergySupplyPeriod']>;

export type EnergySupplier = {
  gln?: CommercialRelation['energySupplier'];
  name?: NonNullable<CommercialRelation['energySupplierName']>['value'];
  validFrom?: ActiveEnergySupplyPeriod['validFrom'];
};

export type Contact = ActiveEnergySupplyPeriod['customers'][0];

export type InstallationAddress = NonNullable<
  MeteringPointDetails['metadata']
>['installationAddress'];

export type MoveInCustomerDetailsFormType = {
  transactionId: FormControl<string>;
  cutOffDate: FormControl<string>;
  reason: FormControl<string>;
  customerType: FormControl<'private' | 'business'>;
  privateCustomer?: FormGroup<{
    name1: FormControl<string>;
    cpr1: FormControl<string>;
    name2: FormControl<string | undefined>;
    cpr2: FormControl<string | undefined>;
  }>;
  businessCustomer?: FormGroup<{
    companyName: FormControl<string>;
    cvr: FormControl<string>;
  }>;
  isProtectedAddress: FormControl<boolean>;
};
