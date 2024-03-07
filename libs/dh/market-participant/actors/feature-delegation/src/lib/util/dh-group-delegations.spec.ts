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
import { DelegationMessageType } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhDelegations } from '../dh-delegations';
import { dhGroupDelegations } from './dh-group-delegations';

describe(dhGroupDelegations, () => {
  it('should group delegations by direction and type', () => {
    const delegations = Object.values(DelegationMessageType).map((messageType) => ({
      messageType: messageType as DelegationMessageType,
    })) as DhDelegations;

    const result = dhGroupDelegations(delegations);

    expect(result).toEqual({
      outgoing: [
        {
          type: DelegationMessageType.Rsm016Outbound,
          delegations: [{ messageType: DelegationMessageType.Rsm016Outbound }],
        },
        {
          type: DelegationMessageType.Rsm017Outbound,
          delegations: [{ messageType: DelegationMessageType.Rsm017Outbound }],
        },
      ],
      incoming: [
        {
          type: DelegationMessageType.Rsm012Inbound,
          delegations: [{ messageType: DelegationMessageType.Rsm012Inbound }],
        },
        {
          type: DelegationMessageType.Rsm014Inbound,
          delegations: [{ messageType: DelegationMessageType.Rsm014Inbound }],
        },
        {
          type: DelegationMessageType.Rsm016Inbound,
          delegations: [{ messageType: DelegationMessageType.Rsm016Inbound }],
        },
        {
          type: DelegationMessageType.Rsm017Inbound,
          delegations: [{ messageType: DelegationMessageType.Rsm017Inbound }],
        },
        {
          type: DelegationMessageType.Rsm019Inbound,
          delegations: [{ messageType: DelegationMessageType.Rsm019Inbound }],
        },
      ],
    });
  });
});
