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
  DhBalanceResponsibleAgreementsType,
} from '../balance-responsible-relation-tab/dh-balance-responsible-relation';

export function dhGroupBalanceResponsibleAgreements(
  agreements: DhBalanceResponsibleAgreements
): DhBalanceResponsibleAgreementsByType {
  const groups: DhBalanceResponsibleAgreementsByType = [];

  for (const agreement of agreements) {
    const group = groups.find((group) => group.type === agreement.meteringPointType);

    if (group) {
      group.agreements.push(agreement);
    } else {
      groups.push({
        type: agreement.meteringPointType as DhBalanceResponsibleAgreementsType,
        agreements: [agreement],
      });
    }
  }

  return groups;
}
