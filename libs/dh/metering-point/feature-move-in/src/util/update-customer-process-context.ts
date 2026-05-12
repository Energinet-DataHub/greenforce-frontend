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
  ChangeCustomerCharacteristicsBusinessReason,
  ProcessManagerBusinessReason,
  WorkflowAction,
} from '@energinet-datahub/dh/shared/domain/graphql';

export function getProcessContextBusinessReason(
  processId?: string,
  businessReason?: ProcessManagerBusinessReason
): ProcessManagerBusinessReason | undefined {
  if (!processId) return undefined;
  return businessReason ?? ProcessManagerBusinessReason.CustomerMoveIn;
}

export function mapChangeCustomerCharacteristicsBusinessReason(
  processId?: string,
  businessReason?: ProcessManagerBusinessReason
): ChangeCustomerCharacteristicsBusinessReason {
  if (!processId) return ChangeCustomerCharacteristicsBusinessReason.UpdateMasterDataConsumer;
  if (businessReason === ProcessManagerBusinessReason.ChangeOfEnergySupplier) {
    return ChangeCustomerCharacteristicsBusinessReason.ChangeOfEnergySupplier;
  }

  return ChangeCustomerCharacteristicsBusinessReason.CustomerMoveIn;
}

export function shouldQueryMoveInTemporaryStorage(
  processId?: string,
  businessReason?: ProcessManagerBusinessReason
): boolean {
  return !!processId && businessReason === ProcessManagerBusinessReason.CustomerMoveIn;
}

export function isSendInformationAvailable(
  process:
    | {
        businessReason?: ProcessManagerBusinessReason | null;
        availableActions?: WorkflowAction[] | null;
      }
    | null
    | undefined,
  expectedBusinessReason: ProcessManagerBusinessReason
): boolean {
  return (
    process?.businessReason === expectedBusinessReason &&
    (process.availableActions ?? []).includes(WorkflowAction.SendInformation)
  );
}
