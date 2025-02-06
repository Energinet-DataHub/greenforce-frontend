import { delay, HttpResponse } from 'msw';

import { mswConfig } from '@energinet-datahub/gf/util-msw';
import {
  mockDoesMeteringPointExistQuery,
  mockGetMeteringPointQuery,
} from '@energinet-datahub/dh/shared/domain/graphql';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function meteringPointMocks(apiBase: string) {
  return [doesMeteringPointExists(), getMeteringPoint()];
}

function doesMeteringPointExists() {
  return mockDoesMeteringPointExistQuery(async ({ variables: { meteringPointId } }) => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data:
        meteringPointId === '222222222222222222'
          ? {
              __typename: 'Query',
              meteringPoint: {
                __typename: 'MeteringPointDetails',
                meteringPointId,
              },
            }
          : undefined,
    });
  });
}

function getMeteringPoint() {
  return mockGetMeteringPointQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPoint: {
          __typename: 'MeteringPointDetails',
          meteringPointId: '222222222222222222',
          currentCommercialRelation: {
            __typename: 'CommercialRelationDto',
            customerId: '111111111111111111',
            id: 1,
          },
          currentMeteringPointPeriod: {
            __typename: 'MeteringPointPeriodDto',
            id: 1,
            unit: 'MWh',
          },
        },
      },
    });
  });
}
