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

import {
  getProcessContextBusinessReason,
  isSendInformationAvailable,
  mapChangeCustomerCharacteristicsBusinessReason,
  shouldQueryMoveInTemporaryStorage,
} from '../src/util/update-customer-process-context';

describe('update customer process context', () => {
  it('maps standalone customer updates to UPDATE_MASTER_DATA_CONSUMER', () => {
    expect(mapChangeCustomerCharacteristicsBusinessReason()).toBe(
      ChangeCustomerCharacteristicsBusinessReason.UpdateMasterDataConsumer
    );
  });

  it('maps Move-in process updates to CUSTOMER_MOVE_IN', () => {
    expect(
      mapChangeCustomerCharacteristicsBusinessReason(
        'process-cmi-info',
        ProcessManagerBusinessReason.CustomerMoveIn
      )
    ).toBe(ChangeCustomerCharacteristicsBusinessReason.CustomerMoveIn);
  });

  it('maps Change of Supplier process updates to CHANGE_OF_ENERGY_SUPPLIER', () => {
    expect(
      mapChangeCustomerCharacteristicsBusinessReason(
        'process-cos-info',
        ProcessManagerBusinessReason.ChangeOfEnergySupplier
      )
    ).toBe(ChangeCustomerCharacteristicsBusinessReason.ChangeOfEnergySupplier);
  });

  it('preserves legacy Move-in behavior when a process id has no explicit process business reason', () => {
    expect(getProcessContextBusinessReason('process-cmi-info')).toBe(
      ProcessManagerBusinessReason.CustomerMoveIn
    );
    expect(mapChangeCustomerCharacteristicsBusinessReason('process-cmi-info')).toBe(
      ChangeCustomerCharacteristicsBusinessReason.CustomerMoveIn
    );
  });

  it('queries temporary storage only for Move-in process context', () => {
    expect(
      shouldQueryMoveInTemporaryStorage(
        'process-cmi-info',
        ProcessManagerBusinessReason.CustomerMoveIn
      )
    ).toBe(true);
    expect(
      shouldQueryMoveInTemporaryStorage(
        'process-cos-info',
        ProcessManagerBusinessReason.ChangeOfEnergySupplier
      )
    ).toBe(false);
    expect(shouldQueryMoveInTemporaryStorage()).toBe(false);
  });

  it('allows submit when latest process still matches context and has SEND_INFORMATION', () => {
    expect(
      isSendInformationAvailable(
        {
          businessReason: ProcessManagerBusinessReason.ChangeOfEnergySupplier,
          availableActions: [WorkflowAction.SendInformation],
        },
        ProcessManagerBusinessReason.ChangeOfEnergySupplier
      )
    ).toBe(true);
  });

  it('blocks submit when latest process lost SEND_INFORMATION or changed context', () => {
    expect(
      isSendInformationAvailable(
        {
          businessReason: ProcessManagerBusinessReason.ChangeOfEnergySupplier,
          availableActions: [],
        },
        ProcessManagerBusinessReason.ChangeOfEnergySupplier
      )
    ).toBe(false);
    expect(
      isSendInformationAvailable(
        {
          businessReason: ProcessManagerBusinessReason.CustomerMoveIn,
          availableActions: [WorkflowAction.SendInformation],
        },
        ProcessManagerBusinessReason.ChangeOfEnergySupplier
      )
    ).toBe(false);
  });
});
