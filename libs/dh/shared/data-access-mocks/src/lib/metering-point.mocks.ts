import { delay, HttpResponse } from 'msw';

import { mswConfig } from '@energinet-datahub/gf/util-msw';
import { mockDoesMeteringPointExistQuery } from '@energinet-datahub/dh/shared/domain/graphql';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function meteringPointMocks(apiBase: string) {
  return [doesMeteringPointExists()];
}

export function doesMeteringPointExists() {
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
