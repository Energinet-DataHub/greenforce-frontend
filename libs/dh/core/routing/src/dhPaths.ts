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
const marketParticipantSubPaths = {
  actorsPath: 'actors',
  organizationsPath: 'organizations',
  marketRolesPath: 'market-roles',
} as const;

const eSettSubPaths = {
  outgoingMessagesPath: 'outgoing-messages',
  meteringGridareaImbalancePath: 'metering-gridarea-imbalance',
  imbalanceResponsiblePartiesPath: 'balance-responsible',
} as const;

const adminSubPaths = {
  users: 'users',
  roles: 'roles',
  permissions: 'permissions',
} as const;

const wholesaleSubPaths = {
  requests: 'requests',
  calculations: 'calculations',
} as const;

const meteringPointSubPaths = {
  search: 'search',
  masterData: 'master-data',
  measurements: 'measurements',
  messages: 'messages',
  create: 'create',
  failedMeasurements: 'failed-measurements',
  processOverview: 'process-overview',
  chargeLinks: 'charge-links',
} as const;

const chargeLinksSubPaths = {
  tariffAndSubscription: 'tariff-and-subscription',
  fees: 'fees',
} as const;

const measurementsSubPaths = {
  day: 'day',
  month: 'month',
  year: 'year',
  all: 'all',
  upload: 'upload',
} as const;

const meteringPointDebugSubPaths = {
  meteringPoint: 'metering-point',
  meteringPoints: 'metering-points',
  failedMeasurements: 'failed-measurements',
  meteringPointEvents: 'metering-point-events',
} as const;

const devExamplesSubPaths = {
  processes: 'processes',
} as const;

const gridAreaSubPaths = {
  gridarea: 'gridarea',
} as const;

const reportsSubPaths = {
  overview: 'overview',
  settlements: 'settlements',
  settlementReports: 'settlement-reports',
  missingMeasurementsLog: 'missing-measurements-log',
  measurementsReports: 'measurements-reports',
  imbalancePrices: 'imbalance-prices',
} as const;

const missingMeasurementsLogSubPaths = {
  request: 'request',
} as const;

const chargesSubPaths = {
  prices: 'prices',
  information: 'information',
  history: 'history',
} as const;

const basePaths = {
  devExamples: 'dev-examples',
  meteringPointBasePath: 'metering-point',
  marketParticipantBasePath: 'market-participant',
  messageArchiveBasePath: 'message-archive',
  esettBasePath: 'esett',
  admin: 'admin',
  imbalancPrices: 'imbalance-prices',
  gridAreas: 'grid-areas',
  wholesale: 'wholesale',
  login: 'login',
  meteringPointDebug: 'metering-point-debug',
  reports: 'reports',
  charges: 'charges',
} as const;

export type MarketParticipantSubPaths =
  (typeof marketParticipantSubPaths)[keyof typeof marketParticipantSubPaths];

export type BasePaths = (typeof basePaths)[keyof typeof basePaths];

export type ESettSubPaths = (typeof eSettSubPaths)[keyof typeof eSettSubPaths];

export type WholesaleSubPaths = (typeof wholesaleSubPaths)[keyof typeof wholesaleSubPaths];

export type MeteringPointSubPaths =
  (typeof meteringPointSubPaths)[keyof typeof meteringPointSubPaths];

export type MeteringPointDebugSubPaths =
  (typeof meteringPointDebugSubPaths)[keyof typeof meteringPointDebugSubPaths];

export type AdminSubPaths = (typeof adminSubPaths)[keyof typeof adminSubPaths];

export type DevExamplesSubPaths = (typeof devExamplesSubPaths)[keyof typeof devExamplesSubPaths];

export type ReportsSubPaths = (typeof reportsSubPaths)[keyof typeof reportsSubPaths];

export type MeasurementsSubPaths = (typeof measurementsSubPaths)[keyof typeof measurementsSubPaths];

export type MissingMeasurementsLogSubPaths =
  (typeof missingMeasurementsLogSubPaths)[keyof typeof missingMeasurementsLogSubPaths];

export type GridAreaSubPaths = (typeof gridAreaSubPaths)[keyof typeof gridAreaSubPaths];

export type ChargesSubPaths = (typeof chargesSubPaths)[keyof typeof chargesSubPaths];

export type ChargeLinksSubPaths = (typeof chargeLinksSubPaths)[keyof typeof chargeLinksSubPaths];

type SubPaths =
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
  | ChargeLinksSubPaths;

export const getPath = <T extends BasePaths | SubPaths>(route: T) => route;

export const combinePaths = <T extends BasePaths | SubPaths, Y extends BasePaths | SubPaths>(
  part1: Y,
  part2: T,
  absolute: boolean = true
) => (absolute ? `/${part1}/${part2}` : `${part1}/${part2}`);

export const combineWithIdPaths = <T extends SubPaths, Y extends BasePaths>(
  basePath: Y,
  id: string,
  path: T
) => `/${basePath}/${id}/${path}`;
