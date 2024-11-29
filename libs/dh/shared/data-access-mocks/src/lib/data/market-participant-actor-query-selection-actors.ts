import { EicFunction, GetSelectionActorsQuery } from '@energinet-datahub/dh/shared/domain/graphql';

export const actorQuerySelection: GetSelectionActorsQuery = {
  __typename: 'Query',
  selectionActors: [
    {
      __typename: 'SelectionActorDto',
      id: '3ec41d91-fc6d-4364-ade6-b85576a91d04',
      gln: '5799999933317',
      actorName: 'Energinet DataHub A/S',
      organizationName: 'Test organization 12',
      marketRole: EicFunction.DataHubAdministrator,
    },
    {
      __typename: 'SelectionActorDto',
      id: 'efad0fee-9d7c-49c6-7c16-08da5f28ddb1',
      gln: '5799999933318',
      actorName: 'Test Actor',
      organizationName: 'Test organization 22',
      marketRole: EicFunction.BalanceResponsibleParty,
    },
  ],
};
