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
import {
  DhBalanceResponsibleAgreements,
  DhBalanceResponsibleAgreementsByType,
  DhBalanceResponsibleAgreementsGrouped,
  DhBalanceResponsibleAgreementsType,
} from '../balance-responsible-relation-tab/dh-balance-responsible-relation';

export function dhGroupBalanceResponsibleRelationsByType(
  relations: DhBalanceResponsibleAgreements
): DhBalanceResponsibleAgreementsByType {
  const groups: DhBalanceResponsibleAgreementsByType = [];

  for (const relation of relations) {
    const group = groups.find((group) => group.type === relation.meteringPointType);

    if (group) {
      group.agreements.push(relation);
    } else {
      groups.push({
        type: relation.meteringPointType as DhBalanceResponsibleAgreementsType,
        agreements: [relation],
      });
    }
  }

  return groups;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export function dhGroupByMarketParticipant(
  groupsByType: DhBalanceResponsibleAgreementsByType,
  propertyToGroupBy: 'balanceResponsibleWithName' | 'energySupplierWithName'
): DhBalanceResponsibleAgreementsGrouped {
  const groups: DhBalanceResponsibleAgreementsGrouped = [];

  for (const group of groupsByType) {
    const groupByMarketParticipant: DhBalanceResponsibleAgreementsGrouped[0]['marketParticipants'] =
      [];

    for (const relation of group.agreements) {
      const marketParticipant = groupByMarketParticipant.find(
        (mp) => mp.id === relation[propertyToGroupBy]?.id
      );

      if (marketParticipant) {
        marketParticipant.agreements.push(relation);
      } else {
        groupByMarketParticipant.push({
          id: relation[propertyToGroupBy]?.id ?? '',
          displayName: relation[propertyToGroupBy]?.actorName.value ?? '',
          agreements: [relation],
        });
      }
    }

    groups.push({
      type: group.type,
      marketParticipants: groupByMarketParticipant,
    });
  }

  return groups;
}
