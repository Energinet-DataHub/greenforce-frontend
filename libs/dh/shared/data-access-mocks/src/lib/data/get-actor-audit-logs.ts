//#region License
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
//#endregion

/* eslint-disable sonarjs/no-duplicate-string */

import {
  ActorAuditedChange,
  GetActorAuditLogsQuery,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const getActorAuditLogsMock: GetActorAuditLogsQuery = {
  __typename: 'Query',
  actorById: {
    __typename: 'Actor',
    id: '801011ea',
    auditLogs: [
      {
        __typename: 'ActorAuditedChangeAuditLogDto',
        auditedBy: 'John Doe',
        currentValue: 'Aktørnavn2',
        previousValue: 'Aktørnavn',
        change: ActorAuditedChange.Name,
        isInitialAssignment: false,
        timestamp: new Date('2021-08-14T12:30:01'),
        consolidation: null,
        delegation: null,
      },
      {
        __typename: 'ActorAuditedChangeAuditLogDto',
        auditedBy: 'John Doe',
        currentValue: 'Active',
        previousValue: 'InActive',
        change: ActorAuditedChange.Status,
        isInitialAssignment: false,
        timestamp: new Date('2021-08-14T12:30:02'),
        consolidation: null,
        delegation: null,
      },
      {
        __typename: 'ActorAuditedChangeAuditLogDto',
        auditedBy: 'John Doe',
        currentValue: 'MyAndMe',
        previousValue: 'MeAndMy',
        change: ActorAuditedChange.ContactName,
        isInitialAssignment: false,
        timestamp: new Date('2021-08-14T12:32:04'),
        consolidation: null,
        delegation: null,
      },
      {
        __typename: 'ActorAuditedChangeAuditLogDto',
        auditedBy: 'John Doe',
        currentValue: 'Aktør kontakt 2',
        previousValue: 'Aktør kontakt 1',
        change: ActorAuditedChange.ContactName,
        isInitialAssignment: false,
        timestamp: new Date('2021-08-14T12:32:06'),
        consolidation: null,
        delegation: null,
      },
      {
        __typename: 'ActorAuditedChangeAuditLogDto',
        auditedBy: 'John Doe',
        currentValue: '(efad0fee-9d7c-49c6-7c16-08da5f28ddb1;2024-03-01;1;RequestWholesaleResults)',
        previousValue: null,
        change: ActorAuditedChange.DelegationStart,
        isInitialAssignment: false,
        timestamp: new Date('2024-02-01T12:32:06'),
        consolidation: null,
        delegation: {
          __typename: 'ActorDelegationAuditLog',
          actor: 'Sort Størm A/S',
          gln: '5790001330583',
          processType: 'RequestWholesaleResults',
          gridAreaName: 'DK1',
          startsAt: '2024-03-01',
          stopsAt: null,
        },
      },
      {
        __typename: 'ActorAuditedChangeAuditLogDto',
        auditedBy: 'Jane Doe',
        currentValue:
          '(efad0fee-9d7c-49c6-7c16-08da5f28ddb1;2024-03-01;1;RequestWholesaleResults;2024-04-01)',
        previousValue: null,
        change: ActorAuditedChange.DelegationStop,
        isInitialAssignment: false,
        timestamp: new Date('2024-03-15T12:32:06'),
        consolidation: null,
        delegation: {
          __typename: 'ActorDelegationAuditLog',
          actor: 'Sort Størm A/S',
          gln: '5790001330583',
          processType: 'RequestWholesaleResults',
          gridAreaName: 'DK1',
          startsAt: '2024-03-01',
          stopsAt: '2024-04-01',
        },
      },
      {
        __typename: 'ActorAuditedChangeAuditLogDto',
        auditedBy: 'John Doe',
        currentValue: '(efad0fee-9d7c-49c6-7c16-08da5f28ddb1;2024-03-01;1;RequestWholesaleResults)',
        previousValue: null,
        change: ActorAuditedChange.ConsolidationRequested,
        isInitialAssignment: false,
        timestamp: new Date('2024-02-01T12:32:06'),
        consolidation: {
          __typename: 'ActorConsolidationAuditLog',
          currentOwner: 'Sort Størm A/S',
          currentOwnerGln: '5790001330583',
          previousOwnerGln: '545443330583',
          previousOwner: 'Grøn Størm A/S',
          previousOwnerStopsAt: new Date('2024-04-01'),
        },
        delegation: null,
      },
      {
        __typename: 'ActorAuditedChangeAuditLogDto',
        auditedBy: 'Jane Doe',
        currentValue:
          '(efad0fee-9d7c-49c6-7c16-08da5f28ddb1;2024-03-01;1;RequestWholesaleResults;2024-04-01)',
        previousValue: null,
        change: ActorAuditedChange.ConsolidationCompleted,
        isInitialAssignment: false,
        timestamp: new Date('2024-03-15T12:32:06'),
        consolidation: {
          __typename: 'ActorConsolidationAuditLog',
          currentOwner: 'Sort Størm A/S',
          currentOwnerGln: '5790001330583',
          previousOwnerGln: '545443330583',
          previousOwner: 'Grøn Størm A/S',
          previousOwnerStopsAt: new Date('2024-04-01'),
        },
        delegation: null,
      },
    ],
  },
};
