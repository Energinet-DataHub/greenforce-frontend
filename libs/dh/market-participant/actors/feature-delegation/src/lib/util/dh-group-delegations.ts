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

import {
  DhDelegations,
  DhDelegationsByDirection,
  DhDelegationsByType,
  DhDelegationsGrouped,
} from '../dh-delegations';

const outgoingTypes = [DelegationMessageType.Rsm016Outbound, DelegationMessageType.Rsm017Outbound];
const incomingTypes = [
  DelegationMessageType.Rsm012Inbound,
  DelegationMessageType.Rsm014Inbound,
  DelegationMessageType.Rsm016Inbound,
  DelegationMessageType.Rsm017Inbound,
  DelegationMessageType.Rsm019Inbound,
];

export function dhGroupDelegations(delegations: DhDelegations): DhDelegationsGrouped {
  const groups = dhGroupByDirection(delegations);

  return {
    outgoing: dhGroupByType(groups.outgoing),
    incoming: dhGroupByType(groups.incoming),
  };
}

function dhGroupByDirection(delegations: DhDelegations): DhDelegationsByDirection {
  const groups: DhDelegationsByDirection = {
    outgoing: [],
    incoming: [],
  };

  for (const delegation of delegations) {
    if (outgoingTypes.includes(delegation.messageType)) {
      groups.outgoing.push(delegation);
    } else if (incomingTypes.includes(delegation.messageType)) {
      groups.incoming.push(delegation);
    }
  }

  return groups;
}

function dhGroupByType(delegations: DhDelegations): DhDelegationsByType[] {
  const groups: DhDelegationsByType[] = [];

  for (const delegation of delegations) {
    const index = groups.findIndex((group) => group.type === delegation.messageType);

    if (index === -1) {
      groups.push({ type: delegation.messageType, delegations: [delegation] });
    } else {
      groups[index].delegations?.push(delegation);
    }
  }

  return groups;
}
