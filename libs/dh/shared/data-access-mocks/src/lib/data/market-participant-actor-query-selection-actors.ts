import { SelectionActorDto, EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';

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
export const actorQuerySelection: SelectionActorDto[] = [
  {
    __typename: 'SelectionActorDto',
    id: '3ec41d91-fc6d-4364-ade6-b85576a91d04',
    gln: '5799999933317',
    actorName: 'Energinet DataHub A/S',
    organizationName: 'Test organization 12',
    marketRole: EicFunction.DataHubAdministrator,
  },
  {
    __typename: 'SelectionActorDto',
    id: 'efad0fee-9d7c-49c6-7c16-08da5f28ddb1',
    gln: '5799999933318',
    actorName: 'Test Actor',
    organizationName: 'Test organization 22',
    marketRole: EicFunction.BalanceResponsibleParty,
  },
];
