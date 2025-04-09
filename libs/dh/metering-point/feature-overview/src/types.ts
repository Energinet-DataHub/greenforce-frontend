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
import {
  GetMeasurementsWithHistoryDocument,
  GetMeasurementsWithHistoryQueryVariables,
  GetMeasurementsByIdDocument,
  GetMeasurementsByIdQueryVariables,
  GetMeteringPointByIdDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import type { ResultOf } from '@graphql-typed-document-node/core';

export type MeteringPointDetails = ResultOf<typeof GetMeteringPointByIdDocument>['meteringPoint'];

export type MeteringPoint = NonNullable<MeteringPointDetails['metadata']>;

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

export type MeasurementPosition = ResultOf<
  typeof GetMeasurementsWithHistoryDocument
>['measurementsWithHistory']['measurementPositions'][0];

export type Measurement = ResultOf<typeof GetMeasurementsByIdDocument>['measurements'][0];

export type MeasurementWithHistory = MeasurementPosition['measurementPoints'][0];

export type CurrentMeasurementWithHistory = MeasurementPosition['current'];

export type RelatedMeteringPoints = NonNullable<MeteringPointDetails['relatedMeteringPoints']>;

export type MeasurementsWithHistoryQueryVariables =
  Partial<GetMeasurementsWithHistoryQueryVariables>;

export type QueryVariables = Partial<GetMeasurementsByIdQueryVariables>;
