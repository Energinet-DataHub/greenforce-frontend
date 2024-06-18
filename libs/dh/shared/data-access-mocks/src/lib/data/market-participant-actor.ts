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
export const actorData = {
  actorId: 'efad0fee-9d7c-49c6-7c17-08da5f28ddb1',
  externalActorId: '8b93b711-a4f8-4434-b7ec-794e408316fa',
  actorNumber: { value: '9561643029441' },
  status: 'Active',
  name: { value: 'Navn Ændret' },
  marketRoles: [
    {
      eicFunction: 'BalanceResponsibleParty',
      gridAreas: [
        {
          id: '2f8197d5-05a7-4f68-957c-73d95d1c9289',
          meteringPointTypes: ['D01VeProduction', 'D03NotUsed'],
        },
      ],
      comment: 'Test kommentar',
    },
  ],
};
