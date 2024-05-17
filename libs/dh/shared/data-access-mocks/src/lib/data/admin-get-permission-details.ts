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
import { dayjs } from '@energinet-datahub/watt/utils/date';

import {
  EicFunction,
  GetPermissionDetailsQuery,
  UserRoleStatus,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const adminPermissionDetailsMock: GetPermissionDetailsQuery = {
  __typename: 'Query',
  permissionById: {
    __typename: 'Permission',
    id: 1,
    name: 'organizations:view',
    description: 'Description for OrganizationView',
    created: dayjs('2023-03-07T00:00:00+00:00').toDate(),
    assignableTo: [EicFunction.BalanceResponsibleParty, EicFunction.BillingAgent],
    userRoles: [
      {
        __typename: 'UserRoleDto',
        id: '2ca09c29-ffc9-4155-d925-08db05f27124',
        name: 'Test role 1',
        description: 'Description 1',
        eicFunction: EicFunction.BillingAgent,
        status: UserRoleStatus.Active,
      },
    ],
  },
};
