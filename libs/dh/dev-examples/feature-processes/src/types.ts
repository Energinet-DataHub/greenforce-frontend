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
import { GetProcessByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { GetProcessesDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';
import { ExtractNodeType } from '@energinet-datahub/dh/shared/util-apollo';
import type { ResultOf } from '@graphql-typed-document-node/core';
export type Process = ExtractNodeType<GetProcessesDataSource>;

export type DhProcessDetailsComponent = ResultOf<typeof GetProcessByIdDocument>['processById'];

export type DhProcessCalculation = Extract<
  DhProcessDetailsComponent,
  { __typename: 'WholesaleAndEnergyCalculation' }
>;

export type DhProcessCalculationGridArea = DhProcessCalculation['gridAreas'][0];

export type DhProcessEnergyTimeSeriesRequest = Extract<
  DhProcessDetailsComponent,
  { __typename: 'RequestCalculatedEnergyTimeSeriesResult' }
>;

export type DhProcessWholesaleRequest = Extract<
  DhProcessDetailsComponent,
  { __typename: 'RequestCalculatedWholesaleServicesResult' }
>;
