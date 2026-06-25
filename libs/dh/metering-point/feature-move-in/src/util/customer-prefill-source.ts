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
import { ChangeCustomerCharacteristicsBusinessReason } from '@energinet-datahub/dh/shared/domain/graphql';

/**
 * Where the "Update customer data" form prefills its values from.
 * - `metering-point`: the metering point's current commercial relation.
 * - `metering-point-customer-identification`: only the metering point's current
 *   primary customer name/CVR and secondary customer name.
 * - `temporary-storage`: the process's temporary storage payload
 *   (requires a `processId`).
 */
export type CustomerPrefillSource =
  | 'metering-point'
  | 'metering-point-customer-identification'
  | 'temporary-storage';

/**
 * Prefill source per business process (BRS). Add an entry when a new BRS is
 * introduced; missing entries fall back to `metering-point`.
 */
const PREFILL_SOURCE: Partial<
  Record<ChangeCustomerCharacteristicsBusinessReason, CustomerPrefillSource>
> = {
  // BRS-001 Change of energy supplier
  [ChangeCustomerCharacteristicsBusinessReason.ChangeOfEnergySupplier]:
    'metering-point-customer-identification',
  // BRS-009 Move in
  [ChangeCustomerCharacteristicsBusinessReason.CustomerMoveIn]: 'temporary-storage',
  [ChangeCustomerCharacteristicsBusinessReason.SecondaryMoveIn]: 'temporary-storage',
  // BRS-015 Update customer master data
  [ChangeCustomerCharacteristicsBusinessReason.UpdateMasterDataConsumer]: 'metering-point',
};

export function getCustomerPrefillSource(
  reason: ChangeCustomerCharacteristicsBusinessReason | undefined
): CustomerPrefillSource {
  return (reason && PREFILL_SOURCE[reason]) ?? 'metering-point';
}

export function resolveCustomerPrefillValue({
  source,
  temporaryStorageValue,
  meteringPointValue,
  temporaryStorageLoading,
}: {
  source: CustomerPrefillSource;
  temporaryStorageValue: string | null | undefined;
  meteringPointValue: string | null | undefined;
  temporaryStorageLoading: boolean;
}): string {
  if (source !== 'temporary-storage') return meteringPointValue ?? '';
  if (temporaryStorageLoading) return '';
  return temporaryStorageValue ?? '';
}

// Used by DhUpdateCustomerDataComponent and unit tests.
export function shouldMaskCustomerCprFields(
  reason: ChangeCustomerCharacteristicsBusinessReason | undefined
): boolean {
  return reason === ChangeCustomerCharacteristicsBusinessReason.UpdateMasterDataConsumer;
}
