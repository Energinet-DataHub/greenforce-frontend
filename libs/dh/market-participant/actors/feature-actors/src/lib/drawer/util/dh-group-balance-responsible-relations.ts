import { BalanceResponsibilityAgreementStatus } from '@energinet-datahub/dh/shared/domain/graphql';

import {
  DhBalanceResponsibleRelation,
  DhBalanceResponsibleRelations,
  DhBalanceResponsibleRelationsByType,
  DhBalanceResponsibleRelationsGrouped,
} from '../balance-responsible-relation-tab/dh-balance-responsible-relation';

export function dhGroupByType(
  relations: DhBalanceResponsibleRelations
): DhBalanceResponsibleRelationsByType {
  const groups: DhBalanceResponsibleRelationsByType = [];

  for (const relation of relations) {
    const group = groups.find((group) => group.type === relation.meteringPointType);

    if (group) {
      group.relations.push(relation);
    } else {
      groups.push({
        type: relation.meteringPointType,
        relations: [relation],
      });
    }
  }

  return groups;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export function dhGroupByMarketParticipant(
  groupsByType: DhBalanceResponsibleRelationsByType,
  propertyToGroupBy: keyof Pick<
    DhBalanceResponsibleRelation,
    'balanceResponsibleWithName' | 'energySupplierWithName'
  >
): DhBalanceResponsibleRelationsGrouped {
  const groups: DhBalanceResponsibleRelationsGrouped = [];

  for (const group of groupsByType) {
    const marketParticipants: DhBalanceResponsibleRelationsGrouped[0]['marketParticipants'] = [];

    for (const relation of group.relations) {
      const marketParticipant = marketParticipants.find(
        (mp) => mp.id === relation[propertyToGroupBy]?.id
      );

      if (marketParticipant) {
        marketParticipant.relations.push(relation);
      } else {
        marketParticipants.push({
          id: relation[propertyToGroupBy]?.id ?? '',
          displayName: relation[propertyToGroupBy]?.actorName.value ?? '',
          relations: [relation],
          allRelationsHaveExpired: false,
        });
      }
    }

    groups.push({
      type: group.type,
      marketParticipants: marketParticipants.map((mp) => ({
        ...mp,
        allRelationsHaveExpired: mp.relations.every(
          (relation) => relation.status === BalanceResponsibilityAgreementStatus.Expired
        ),
      })),
    });
  }

  return groups;
}
