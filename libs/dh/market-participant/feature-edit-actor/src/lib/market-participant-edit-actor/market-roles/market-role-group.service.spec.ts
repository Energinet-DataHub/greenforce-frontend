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

import { EicFunction } from '@energinet-datahub/dh/shared/domain';
import { EditableMarketRoleRow } from './dh-market-participant-actor-market-roles.component';
import { MarketRoleGroupService } from './market-role-group.service';

describe(MarketRoleGroupService.name, () => {
  test('should group grid areas under same market role', () => {
    // arrange
    const target = new MarketRoleGroupService();
    const input: EditableMarketRoleRow[] = [
      {
        marketRole: EicFunction.Agent,
        gridArea: 'ga1',
        meteringPointTypes: [],
      },
      {
        marketRole: EicFunction.BalanceResponsibleParty,
        gridArea: 'ga3',
        meteringPointTypes: [],
      },
      {
        marketRole: EicFunction.Agent,
        gridArea: 'ga2',
        meteringPointTypes: [],
      },
    ];

    // act
    const marketRoles = target.groupRows(input);
    const agentMarketRoles = marketRoles.filter(
      (x) => x.marketRole === EicFunction.Agent
    );
    const agentMarketRoleGridAreas = agentMarketRoles[0].gridAreas;

    // assert
    expect(marketRoles).toHaveLength(2);
    expect(agentMarketRoles).toHaveLength(1);
    expect(agentMarketRoleGridAreas).toEqual([
      {
        id: 'ga1',
        meteringPointTypes: [],
      },
      {
        id: 'ga2',
        meteringPointTypes: [],
      },
    ]);
  });
});
