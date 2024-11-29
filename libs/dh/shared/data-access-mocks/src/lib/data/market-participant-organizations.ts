import { GetOrganizationsQuery } from '@energinet-datahub/dh/shared/domain/graphql';

export const getOrganizationsQueryMock: GetOrganizationsQuery = {
  __typename: 'Query',
  organizations: [
    {
      __typename: 'Organization',
      id: 'b3bdd441-4f22-3f33-b88f-08da5f288474',
      businessRegisterIdentifier: '12345677',
      name: 'Sort Strøm',
      domains: ['sortstrom.dk', 'kulsortstorm.dk'],
    },
    {
      __typename: 'Organization',
      id: '23f2fca9-2b4b-1150-99e9-08dbc66e2700',
      businessRegisterIdentifier: '99990115',
      name: 'Hvid Strøm',
      domains: ['hvidstrom.dk'],
    },
  ],
};
