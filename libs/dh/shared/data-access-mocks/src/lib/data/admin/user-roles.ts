import {
  EicFunction,
  UserRoleDto,
  UserRoleStatus,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const userRoles: UserRoleDto[] = [
  {
    __typename: 'UserRoleDto',
    id: '512b2941-e82e-4097-aa4b-ec322871a3e6',
    description: 'DataHub Administrator',
    eicFunction: EicFunction.DataHubAdministrator,
    name: 'DataHub Administrator',
    status: UserRoleStatus.Active,
  },
  {
    __typename: 'UserRoleDto',
    id: 'b5b8b2b1-7b2e-4d0b-8c4f-0e1a4b2f7d1b',
    description: 'Metered Data Responsible',
    eicFunction: EicFunction.MeteredDataResponsible,
    name: 'Metered Data Responsible',
    status: UserRoleStatus.Active,
  },
  {
    __typename: 'UserRoleDto',
    id: '3',
    description: 'Imbalance Settlement Responsible',
    eicFunction: EicFunction.ImbalanceSettlementResponsible,
    name: 'Imbalance Settlement Responsible',
    status: UserRoleStatus.Inactive,
  },
  {
    __typename: 'UserRoleDto',
    id: '4',
    description: 'Danish Energy Agency',
    eicFunction: EicFunction.DanishEnergyAgency,
    name: 'Danish Energy Agency',
    status: UserRoleStatus.Active,
  },
  {
    __typename: 'UserRoleDto',
    id: '5',
    description: 'Independent Aggregator',
    eicFunction: EicFunction.IndependentAggregator,
    name: 'Independent Aggregator',
    status: UserRoleStatus.Inactive,
  },
  {
    __typename: 'UserRoleDto',
    id: '6',
    description: 'Grid Access Provider',
    eicFunction: EicFunction.GridAccessProvider,
    name: 'Grid Access Provider',
    status: UserRoleStatus.Active,
  },
];
