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
import { EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';
import { ActorForRequestCalculation } from '@energinet-datahub/dh/wholesale/domain';

export const getActorsForRequestCalculation: ActorForRequestCalculation[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    marketRole: EicFunction.BalanceResponsibleParty,
    value: '8200000001553',
    displayValue: '-',
    __typename: 'Actor',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    marketRole: EicFunction.BalanceResponsibleParty,
    value: '7914351637149',
    displayValue: '-',
    __typename: 'Actor',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    marketRole: EicFunction.BalanceResponsibleParty,
    value: '3583430789310',
    displayValue: '-',
    __typename: 'Actor',
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    marketRole: EicFunction.EnergySupplier,
    value: '1193300930098',
    displayValue: '-',
    __typename: 'Actor',
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    marketRole: EicFunction.EnergySupplier,
    value: '0781383147284',
    displayValue: '-',
    __typename: 'Actor',
  },
  {
    id: '00000000-0000-0000-0000-000000000006',
    marketRole: EicFunction.BalanceResponsibleParty,
    value: '9561643029441',
    displayValue: 'Navn Ændret',
    __typename: 'Actor',
  },
  {
    id: '00000000-0000-0000-0000-000000000007',
    marketRole: EicFunction.EnergySupplier,
    value: '9561643029441',
    displayValue: '12341312',
    __typename: 'Actor',
  },
];
