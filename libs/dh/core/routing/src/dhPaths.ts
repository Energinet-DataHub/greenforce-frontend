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

export type MarketParticipantSubPaths = 'actors' | 'organizations' | 'market-roles';

export type ESettSubPaths =
  | 'outgoing-messages'
  | 'metering-gridarea-imbalance'
  | 'balance-responsible';

export type AdminSubPaths = 'users' | 'roles' | 'permissions';

export type WholesaleSubPaths = 'requests' | 'calculations';

export type MeteringPointSubPaths =
  | 'search'
  | 'master-data'
  | 'measurements'
  | 'messages'
  | 'create'
  | 'failed-measurements'
  | 'process-overview'
  | 'charge-links'
  | 'update-customer-details'
  | 'actor-conversation';

export type ChargeLinksSubPaths = 'tariff-and-subscription' | 'fees' | 'create';

export type MeasurementsSubPaths = 'day' | 'month' | 'year' | 'all' | 'upload';

export type MeteringPointDebugSubPaths =
  | 'metering-point'
  | 'metering-points'
  | 'failed-measurements'
  | 'metering-point-events';

export type DevExamplesSubPaths = 'processes';

export type GridAreaSubPaths = 'gridarea';

export type ReportsSubPaths =
  | 'overview'
  | 'settlements'
  | 'settlement-reports'
  | 'missing-measurements-log'
  | 'measurements-reports'
  | 'imbalance-prices';

export type MissingMeasurementsLogSubPaths = 'request';

export type ChargesSubPaths = 'prices' | 'information' | 'history';

export type OperationToolsSubPaths = 'metering-point';

export type BasePaths =
  | 'dev-examples'
  | 'metering-point'
  | 'market-participant'
  | 'message-archive'
  | 'esett'
  | 'admin'
  | 'imbalance-prices'
  | 'grid-areas'
  | 'wholesale'
  | 'login'
  | 'reports'
  | 'charges'
  | 'operation-tools';

export type SubPaths =
  | MarketParticipantSubPaths
  | ESettSubPaths
  | WholesaleSubPaths
  | AdminSubPaths
  | MeteringPointSubPaths
  | MeteringPointDebugSubPaths
  | DevExamplesSubPaths
  | MeasurementsSubPaths
  | ReportsSubPaths
  | MissingMeasurementsLogSubPaths
  | GridAreaSubPaths
  | ChargesSubPaths
  | ChargeLinksSubPaths
  | OperationToolsSubPaths;

export const getPath = <T extends BasePaths | SubPaths>(route: T) => route;

export const combinePaths = <T extends BasePaths | SubPaths, Y extends BasePaths | SubPaths>(
  part1: Y,
  part2: T,
  absolute = true
) => (absolute ? `/${part1}/${part2}` : `${part1}/${part2}`);

export const combineWithIdPaths = <T extends SubPaths, Y extends BasePaths>(
  basePath: Y,
  id: string,
  path: T
) => `/${basePath}/${id}/${path}`;
