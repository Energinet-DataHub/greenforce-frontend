import {
  ActorStatus,
  EicFunction,
  Organization,
  Actor,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const actors = (organizationId: string): Actor[] => [
  {
    __typename: 'Actor',
    id: '801011ea-a291-41f7-be19-581abc05a5ac',
    glnOrEicNumber: '5790000555465',
    name: 'Inactive balance responsible',
    gridAreas: [],
    marketRole: EicFunction.BalanceResponsibleParty,
    status: ActorStatus.Inactive,
    organization: {
      __typename: 'Organization',
      organizationId,
      name: '',
    } as Organization,
  },
  {
    __typename: 'Actor',
    id: '9c3be101-1471-4a1a-8f52-ddb619778f8f',
    glnOrEicNumber: '5790000555466',
    name: 'Active energy supplier',
    gridAreas: [],
    marketRole: EicFunction.EnergySupplier,
    status: ActorStatus.Active,
    organization: {
      __typename: 'Organization',
      organizationId,
      name: '',
    } as Organization,
  },
];
