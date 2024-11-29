import { DhDelegations, DhDelegationsByType } from '../dh-delegations';

export function dhGroupDelegations(delegations: DhDelegations): DhDelegationsByType {
  const groups: DhDelegationsByType = [];

  for (const delegation of delegations) {
    const index = groups.findIndex((group) => group.type === delegation.process);

    if (index === -1) {
      groups.push({ type: delegation.process, delegations: [delegation] });
    } else {
      groups[index].delegations?.push(delegation);
    }
  }

  return groups;
}
