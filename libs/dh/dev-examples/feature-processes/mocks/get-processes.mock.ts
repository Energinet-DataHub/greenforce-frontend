import { delay, HttpResponse } from 'msw';
import { mswConfig } from '@energinet-datahub/gf/util-msw';
import { mockGetProcessesQuery } from '@energinet-datahub/dh/shared/domain/graphql';

import processes from './data';

export function getProcesses() {
  return mockGetProcessesQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        processes: {
          __typename: 'ProcessesConnection',
          pageInfo: {
            __typename: 'PageInfo',
            startCursor: null,
            endCursor: null,
          },
          totalCount: processes.length,
          nodes: processes,
        },
      },
    });
  });
}
