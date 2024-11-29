import { dayjs } from '@energinet-datahub/watt/date';

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
