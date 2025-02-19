import { delay, HttpResponse } from 'msw';
import { mswConfig } from '@energinet-datahub/gf/util-msw';
import { mockGetProcessByIdQuery } from '@energinet-datahub/dh/shared/domain/graphql';

import processes from './data';

export function getProcess() {
  return mockGetProcessByIdQuery(async ({ variables: { id } }) => {
    await delay(mswConfig.delay);

    const process = processes.find((process) => process.id === id);

    if (!process) {
      return HttpResponse.json({
        errors: [
          {
            cause: 'NOT_FOUND',
            message: `Process with id ${id} not found`,
          },
        ],
      });
    }

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        processById: process,
      },
    });
  });
}
