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
import { DelegatedProcess } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhDelegations } from '../dh-delegations';
import { dhGroupDelegations } from './dh-group-delegations';

describe(dhGroupDelegations, () => {
  it('should group delegations by type', () => {
    const delegations = Object.values(DelegatedProcess).map((messageType) => ({
      process: messageType as DelegatedProcess,
    })) as DhDelegations;

    const result = dhGroupDelegations(delegations);

    expect(result).toEqual([
      {
        type: DelegatedProcess.RequestEnergyResults,
        delegations: [{ process: DelegatedProcess.RequestEnergyResults }],
      },
      {
        type: DelegatedProcess.ReceiveEnergyResults,
        delegations: [{ process: DelegatedProcess.ReceiveEnergyResults }],
      },
      {
        type: DelegatedProcess.RequestWholesaleResults,
        delegations: [{ process: DelegatedProcess.RequestWholesaleResults }],
      },
      {
        type: DelegatedProcess.ReceiveWholesaleResults,
        delegations: [{ process: DelegatedProcess.ReceiveWholesaleResults }],
      },
    ]);
  });
});
