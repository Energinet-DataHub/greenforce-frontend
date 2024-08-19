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

import { GetPermissionsQuery } from '@energinet-datahub/dh/shared/domain/graphql';

export const adminPermissionsMock = (apiBase: string): GetPermissionsQuery => ({
  __typename: 'Query',
  permissions: {
    __typename: 'Permissions',
    getPermissionRelationsUrl: `${apiBase}/v1/MarketParticipantPermissions/GetPermissionRelationsCSV`,
    permissions: [
      {
        __typename: 'Permission',
        id: 1,
        name: 'organizations:view',
        description: 'Description for OrganizationView',
        created: dayjs('2023-03-07T00:00:00+00:00').toDate(),
      },
      {
        __typename: 'Permission',
        id: 2,
        name: 'actors:manage',
        description: 'Description for ActorsManage',
        created: dayjs('2023-03-07T00:00:00+00:00').toDate(),
      },
    ],
  },
});
