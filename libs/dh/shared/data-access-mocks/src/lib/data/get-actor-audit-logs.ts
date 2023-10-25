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
import { graphql } from '@energinet-datahub/dh/shared/domain';
import { ActorAuditLogType, ContactCategory } from '@energinet-datahub/dh/shared/domain/graphql';

export const getActorAuditLogsMock: graphql.GetAuditLogByActorIdQuery = {
  __typename: 'Query',
  actorAuditLogs: [
    {
      __typename: 'ActorAuditLog',
      changedByUserName: 'John Doe',
      currentValue: '',
      previousValue: '',
      type: ActorAuditLogType.Created,
      contactCategory: ContactCategory.Default,
      timestamp: new Date('2021-08-14T12:30:00'),
    },
    {
      __typename: 'ActorAuditLog',
      changedByUserName: 'John Doe',
      currentValue: 'Aktørnavn2',
      previousValue: 'Aktørnavn',
      type: ActorAuditLogType.Name,
      contactCategory: ContactCategory.Default,
      timestamp: new Date('2021-08-14T12:30:01'),
    },
    {
      __typename: 'ActorAuditLog',
      changedByUserName: 'John Doe',
      currentValue: 'Active',
      previousValue: 'InActive',
      type: ActorAuditLogType.Status,
      contactCategory: ContactCategory.Default,
      timestamp: new Date('2021-08-14T12:30:02'),
    },
    {
      __typename: 'ActorAuditLog',
      changedByUserName: 'John Doe',
      currentValue: '',
      previousValue: '',
      type: ActorAuditLogType.ContactCreated,
      contactCategory: ContactCategory.Default,
      timestamp: new Date('2021-08-14T12:31:00'),
    },
    {
      __typename: 'ActorAuditLog',
      changedByUserName: 'John Doe',
      currentValue: '',
      previousValue: '',
      type: ActorAuditLogType.ContactCreated,
      contactCategory: ContactCategory.Charges,
      timestamp: new Date('2021-08-14T12:32:00'),
    },
    {
      __typename: 'ActorAuditLog',
      changedByUserName: 'John Doe',
      currentValue: 'MyAndMe',
      previousValue: 'MeAndMy',
      type: ActorAuditLogType.ContactName,
      contactCategory: ContactCategory.Charges,
      timestamp: new Date('2021-08-14T12:32:04'),
    },
    {
      __typename: 'ActorAuditLog',
      changedByUserName: 'John Doe',
      currentValue: '',
      previousValue: '',
      type: ActorAuditLogType.ContactDeleted,
      contactCategory: ContactCategory.Charges,
      timestamp: new Date('2021-08-14T12:32:05'),
    },
    {
      __typename: 'ActorAuditLog',
      changedByUserName: 'John Doe',
      currentValue: 'Aktør kontakt 2',
      previousValue: 'Aktør kontakt 1',
      type: ActorAuditLogType.ContactName,
      contactCategory: ContactCategory.Default,
      timestamp: new Date('2021-08-14T12:32:06'),
    },
  ],
};
