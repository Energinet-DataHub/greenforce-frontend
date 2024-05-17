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
