import { dayjs } from '@energinet-datahub/watt/date';

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
