import {
  EicFunction,
  GetUserRolesQuery,
  UserRoleStatus,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const userRolesOverview: GetUserRolesQuery = {
  __typename: 'Query',
  userRoles: [
    {
      __typename: 'UserRoleDto',
      id: '512b2941-e82e-4097-aa4b-ec322871a3e6',
      name: 'Basis adgang',
      description: 'Beskrivelse for Basis adgang',
      eicFunction: EicFunction.EnergySupplier,
      status: UserRoleStatus.Active,
    },
    {
      __typename: 'UserRoleDto',
      id: 'b5b8b2b1-7b2e-4d0b-8c4f-0e1a4b2f7d1b',
      name: 'Fuld adgang [Edit error state]',
      description: 'Beskrivevlse for Fuld adgang',
      eicFunction: EicFunction.EnergySupplier,
      status: UserRoleStatus.Active,
    },
    {
      __typename: 'UserRoleDto',
      id: 'ff029a48-b06f-4300-8ec0-84d121a4b83f',
      name: 'Basis adgang [Inaktiv]',
      description: 'Beskrivelse for Basis adgang [Inaktiv]',
      eicFunction: EicFunction.EnergySupplier,
      status: UserRoleStatus.Inactive,
    },
  ],
};
