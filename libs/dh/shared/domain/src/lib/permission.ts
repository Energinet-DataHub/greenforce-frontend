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
export const permissions = [
  'grid-areas:manage',
  'actors:manage',
  'users:manage',
  'users:view',
  'user-roles:manage',
  'calculations:manage',
  'settlement-reports:manage',
  'esett-exchange:manage',
  'request-aggregated-measured-data:view',
  'actor-credentials:manage',
  'imbalance-prices:manage',
  'actor-master-data:manage',
  'delegation:manage',
  'delegation:view',
  'users:reactivate',
  'balance-responsibility:view',
  'request-wholesale-settlement:view',
  'calculations:view',
  'imbalance-prices:view',
  'dh2-bridge:import',
  'metering-point:search',
  'cpr:view',
  'fas',
  'missing-measurements-log:view',
  'measurements-reports:manage',
] as const;

export type Permission = (typeof permissions)[number];
