import { DelegationMessageType } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhDelegations } from '../dh-delegations';
import { dhGroupDelegations } from './dh-group-delegations';

describe(dhGroupDelegations.name, () => {
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
