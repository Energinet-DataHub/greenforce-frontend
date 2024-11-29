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
