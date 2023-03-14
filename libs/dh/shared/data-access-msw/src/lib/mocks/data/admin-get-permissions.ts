import { graphql } from '@energinet-datahub/dh/shared/domain';

export const adminPermissionsMock: graphql.GetPermissionsQuery = {
  permissions: [
    {
      id: 1,
      name: 'OrganizationView',
      description: 'Description for OrganizationView',
    },
    {
      id: 2,
      name: 'OrganizationManage',
      description: 'Description for OrganizationManage',
    },
  ],
};
