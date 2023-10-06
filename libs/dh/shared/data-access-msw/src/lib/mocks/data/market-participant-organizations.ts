import {
  GetOrganizationsQuery,
  OrganizationStatus,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const getOrganizationsQueryMock: GetOrganizationsQuery = {
  __typename: 'Query',
  organizations: [
    {
      __typename: 'OrganizationDto',
      organizationId: 'b3bdd441-4f22-3f33-b88f-08da5f288474',
      name: 'Sort Strøm',
      status: OrganizationStatus.Active,
    },
    {
      __typename: 'OrganizationDto',
      organizationId: '23f2fca9-2b4b-1150-99e9-08dbc66e2700',
      name: 'Hvid Strøm',
      status: OrganizationStatus.New,
    },
  ],
};
