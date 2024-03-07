import {
  DelegationMessageType,
  GetDelegationsForActorQuery,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { dayjs } from '@energinet-datahub/watt/date';

export const getDelegationsForActorMock: GetDelegationsForActorQuery = {
  __typename: 'Query',
  getDelegationsForActor: {
    __typename: 'GetDelegationsForActorResponse',
    delegations: [
      {
        __typename: 'ActorDelegationDto',
        messageType: DelegationMessageType.Rsm016Outbound,
        createdAt: dayjs('2024-01-01T00:00:00+00:00').toDate(),
        expiresAt: dayjs('2024-02-01T00:00:00+00:00').toDate(),
        delegatedTo: {
          __typename: 'ActorId',
          value: '00000000-0000-0000-0000-000000000001',
        },
        gridAreas: [
          {
            __typename: 'GridAreaCode',
            value: '003',
          },
        ],
      },
      {
        __typename: 'ActorDelegationDto',
        messageType: DelegationMessageType.Rsm016Inbound,
        createdAt: dayjs('2024-02-01T00:00:00+00:00').toDate(),
        expiresAt: dayjs('2024-03-01T00:00:00+00:00').toDate(),
        delegatedTo: {
          __typename: 'ActorId',
          value: '00000000-0000-0000-0000-000000000002',
        },
        gridAreas: [
          {
            __typename: 'GridAreaCode',
            value: '116',
          },
        ],
      },
      {
        __typename: 'ActorDelegationDto',
        messageType: DelegationMessageType.Rsm017Outbound,
        createdAt: dayjs('2024-03-01T00:00:00+00:00').toDate(),
        expiresAt: dayjs('2024-03-10T00:00:00+00:00').toDate(),
        delegatedTo: {
          __typename: 'ActorId',
          value: '00000000-0000-0000-0000-000000000003',
        },
        gridAreas: [
          {
            __typename: 'GridAreaCode',
            value: '117',
          },
        ],
      },
    ],
  },
};
