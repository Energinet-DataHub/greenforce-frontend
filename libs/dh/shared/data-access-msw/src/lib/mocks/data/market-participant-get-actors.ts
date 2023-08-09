import {
  ActorStatus,
  EicFunction,
  GetActorsQuery,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const marketParticipantGetActorsMock: GetActorsQuery = {
  actors: [
    {
      glnOrEicNumber: '5790000555555',
      id: 'efad0fee-9d7c-49c6-7c17-08da5f28ddb1',
      name: 'Test Actor 1',
      marketRole: EicFunction.BalanceResponsibleParty,
      status: ActorStatus.Active,
    },
    {
      glnOrEicNumber: '5790000555444',
      id: 'efad0fee-9d7c-49c6-7c18-08da5f28ddb1',
      name: 'Test Actor 2',
      marketRole: EicFunction.DanishEnergyAgency,
      status: ActorStatus.Inactive,
    },
    {
      glnOrEicNumber: '5790000555333',
      id: 'efad0fee-9d7c-49c6-7c19-08da5f28ddb1',
      name: 'Test Actor 3',
      marketRole: EicFunction.ElOverblik,
      status: ActorStatus.New,
    },
    {
      glnOrEicNumber: '5790000555222',
      id: 'efad0fee-9d7c-49c6-7c20-08da5f28ddb1',
      name: 'Test Actor 4',
      marketRole: EicFunction.DataHubAdministrator,
      status: ActorStatus.Passive,
    },
  ],
};
