import {
  ActorDelegationStatus,
  DelegatedProcess,
  GetDelegationsForActorQuery,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { dayjs } from '@energinet-datahub/watt/date';

import { actors } from './get-actors-by-organizationId';

const [delegatedBy, delegatedTo] = actors('10000000-0000-0000-0000-000000000001');

export const getDelegationsForActorMock: GetDelegationsForActorQuery = {
  __typename: 'Query',
  delegationsForActor: [
    {
      __typename: 'MessageDelegationType',
      id: '00000000-0000-0000-0000-000000000001',
      periodId: '00000000-0000-0000-0000-000000000011',
      process: DelegatedProcess.ReceiveEnergyResults,
      validPeriod: {
        start: dayjs('2024-01-01T00:00:00+01:00').toDate(),
        end: dayjs('2024-02-01T23:59:59+01:00').toDate(),
      },
      delegatedBy,
      delegatedTo,
      gridArea: {
        __typename: 'GridAreaDto',
        code: '003',
        id: '00000000-0000-0000-0000-00000grid003',
      },
      status: ActorDelegationStatus.Active,
    },
    {
      __typename: 'MessageDelegationType',
      id: '00000000-0000-0000-0000-000000000002',
      periodId: '00000000-0000-0000-0000-000000000022',
      process: DelegatedProcess.ReceiveEnergyResults,
      validPeriod: {
        start: dayjs('2024-01-01T00:00:00+01:00').toDate(),
        end: dayjs('2024-03-01T23:59:59+01:00').toDate(),
      },
      delegatedBy,
      delegatedTo,
      gridArea: {
        __typename: 'GridAreaDto',
        code: '004',
        id: '00000000-0000-0000-0000-00000grid004',
      },
      status: ActorDelegationStatus.Active,
    },
    {
      __typename: 'MessageDelegationType',
      id: '00000000-0000-0000-0000-000000000003',
      periodId: '00000000-0000-0000-0000-000000000033',
      process: DelegatedProcess.ReceiveWholesaleResults,
      validPeriod: {
        start: dayjs('2024-02-10T00:00:00+01:00').toDate(),
        end: null,
      },
      delegatedBy,
      delegatedTo,
      gridArea: {
        __typename: 'GridAreaDto',
        code: '004',
        id: '00000000-0000-0000-0000-00000grid004',
      },
      status: ActorDelegationStatus.Awaiting,
    },
    {
      __typename: 'MessageDelegationType',
      id: '00000000-0000-0000-0000-000000000004',
      periodId: '00000000-0000-0000-0000-000000000044',
      process: DelegatedProcess.RequestEnergyResults,
      validPeriod: {
        start: dayjs('2024-02-01T00:00:00+01:00').toDate(),
        end: dayjs('2024-03-01T23:59:59+01:01').toDate(),
      },
      delegatedBy,
      delegatedTo,
      gridArea: {
        __typename: 'GridAreaDto',
        code: '116',
        id: '00000000-0000-0000-0000-00000grid116',
      },
      status: ActorDelegationStatus.Cancelled,
    },
    {
      __typename: 'MessageDelegationType',
      id: '00000000-0000-0000-0000-000000000005',
      periodId: '00000000-0000-0000-0000-000000000055',
      process: DelegatedProcess.RequestWholesaleResults,
      validPeriod: {
        start: dayjs('2024-03-01T00:00:00+01:00').toDate(),
        end: dayjs('2024-03-01T23:59:59+01:00').toDate(),
      },
      delegatedBy,
      delegatedTo,
      gridArea: {
        __typename: 'GridAreaDto',
        code: '117',
        id: '00000000-0000-0000-0000-00000grid117',
      },
      status: ActorDelegationStatus.Expired,
    },
  ],
};
