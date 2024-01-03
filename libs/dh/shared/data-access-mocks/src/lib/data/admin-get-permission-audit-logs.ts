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
import { PermissionAuditedChange, PermissionAuditedChangeAuditLogDto } from '@energinet-datahub/dh/shared/domain/graphql';
import parseISO from 'date-fns/parseISO';

export const adminPermissionAuditLogsMock: PermissionAuditedChangeAuditLogDto[] = [
  {
    __typename: 'PermissionAuditedChangeAuditLogDto',
    auditedBy: 'datahub',
    change: PermissionAuditedChange.Claim,
    timestamp: parseISO('2023-03-17'),
    currentValue: 'val1',
    isInitialAssignment: true,
  },
  {
    __typename: 'PermissionAuditedChangeAuditLogDto',
    auditedBy: 'datahub',
    change: PermissionAuditedChange.Description,
    timestamp: parseISO('2023-03-18'),
    currentValue: 'val2',
    isInitialAssignment: false,
  },
  {
    __typename: 'PermissionAuditedChangeAuditLogDto',
    auditedBy: 'datahub',
    change: PermissionAuditedChange.Claim,
    timestamp: parseISO('2023-03-17'),
    currentValue: 'val3',
    isInitialAssignment: false,
  },
];
