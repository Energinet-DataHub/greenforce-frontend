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
// Note: Sorted alphabetically
export const permissions = [
  'actor-credentials:manage',
  'actor-master-data:manage',
  'actors:manage',
  'additional-recipients:manage',
  'additional-recipients:view',
  'balance-responsibility:view',
  'calculations:manage',
  'calculations:view',
  'charges:view',
  'cpr:view',
  'delegation:manage',
  'delegation:view',
  'dh2-bridge:import',
  'esett-exchange:manage',
  'fas',
  'grid-loss-notifications:view',
  'imbalance-prices:manage',
  'imbalance-prices:view',
  'measurements-reports:manage',
  'measurements:manage',
  'metering-point:create',
  'metering-point:move-in',
  'metering-point:search',
  'metering-point:prices',
  'metering-point:prices-manage',
  'metering-point:process-overview',
  'missing-measurements-log:view',
  'request-aggregated-measured-data:view',
  'request-wholesale-settlement:view',
  'settlement-reports:manage',
  'user-roles:manage',
  'users:manage',
  'users:reactivate',
  'users:view',
] as const;

export type Permission = (typeof permissions)[number];
