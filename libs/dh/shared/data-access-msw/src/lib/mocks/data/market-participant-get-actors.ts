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
  ActorStatus,
  EicFunction,
  GetActorsQuery,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const marketParticipantGetActorsMock: GetActorsQuery = {
  actors: [
    {
      glnOrEicNumber: '5790000555555',
      id: 'efad0fee-9d7c-49c6-7c17-08da5f28ddb1',
      name: 'Test Actor 1',
      marketRole: EicFunction.BalanceResponsibleParty,
      status: ActorStatus.Active,
    },
    {
      glnOrEicNumber: '5790000555444',
      id: 'efad0fee-9d7c-49c6-7c18-08da5f28ddb1',
      name: 'Test Actor 2',
      marketRole: EicFunction.DanishEnergyAgency,
      status: ActorStatus.Inactive,
    },
    {
      glnOrEicNumber: '5790000555333',
      id: 'efad0fee-9d7c-49c6-7c19-08da5f28ddb1',
      name: 'Test Actor 3',
      marketRole: EicFunction.ElOverblik,
      status: ActorStatus.New,
    },
    {
      glnOrEicNumber: '5790000555222',
      id: 'efad0fee-9d7c-49c6-7c20-08da5f28ddb1',
      name: 'Test Actor 4',
      marketRole: EicFunction.DataHubAdministrator,
      status: ActorStatus.Passive,
    },
  ],
};
