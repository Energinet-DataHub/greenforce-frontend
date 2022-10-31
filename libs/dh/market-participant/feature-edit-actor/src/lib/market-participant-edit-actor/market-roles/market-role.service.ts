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

import { Injectable } from '@angular/core';
import { EicFunction } from '@energinet-datahub/dh/shared/domain';

@Injectable()
export class MarketRoleService {
  getAvailableMarketRoles = [
    EicFunction.GridAccessProvider,
    EicFunction.MeterAdministrator,
    EicFunction.MeterOperator,
    EicFunction.MeteredDataCollector,
    EicFunction.PartyConnectedToTheGrid,
    EicFunction.SystemOperator,
    EicFunction.BalanceResponsibleParty,
    EicFunction.ConsumptionResponsibleParty,
    EicFunction.ProductionResponsibleParty,
    EicFunction.TradeResponsibleParty,
    EicFunction.EnergySupplier,
    EicFunction.EnergyTrader,
    EicFunction.MeteredDataResponsible,
    EicFunction.ImbalanceSettlementResponsible,
    EicFunction.MeteringPointAdministrator,
    EicFunction.MeteredDataAdministrator,
    EicFunction.DanishEnergyAgency,
  ];

  validEicFunctionGroups = [
    [
      EicFunction.GridAccessProvider,
      EicFunction.MeterAdministrator,
      EicFunction.MeterOperator,
      EicFunction.MeteredDataCollector,
      EicFunction.PartyConnectedToTheGrid,
      EicFunction.MeteredDataResponsible,
    ],
    [EicFunction.SystemOperator],
    [
      EicFunction.BalanceResponsibleParty,
      EicFunction.ConsumptionResponsibleParty,
      EicFunction.ProductionResponsibleParty,
      EicFunction.TradeResponsibleParty,
      EicFunction.EnergySupplier,
      EicFunction.EnergyTrader,
      EicFunction.MeteredDataResponsible,
    ],
    [EicFunction.ImbalanceSettlementResponsible],
    [EicFunction.MeteringPointAdministrator],
    [EicFunction.MeteredDataAdministrator],
    [EicFunction.DanishEnergyAgency],
  ];

  notValidInAnySelectionGroup(
    item: EicFunction,
    currentSelectedList: Array<EicFunction>
  ): boolean {
    if (currentSelectedList.length === 0) {
      return false;
    }

    const possibleGroups = [];
    for (let index = 0; index < this.validEicFunctionGroups.length; index++) {
      const group = this.validEicFunctionGroups[index];

      if (
        currentSelectedList.length &&
        currentSelectedList.every((gItem) => group.indexOf(gItem) >= 0)
      ) {
        possibleGroups.push(group);
      }
    }

    const result = possibleGroups.reduce(
      (accumulator, value) => accumulator.concat(value),
      []
    );

    return result.indexOf(item) < 0;
  }
}
