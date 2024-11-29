import { HttpResponse, delay } from 'msw';

import { mockGetOrganizationEditQuery } from '@energinet-datahub/dh/shared/domain/graphql';
import { mswConfig } from '@energinet-datahub/gf/util-msw';

export function organizationMocks() {
  return [organizationEditMock()];
}

function organizationEditMock() {
  return mockGetOrganizationEditQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        organizationById: {
          __typename: 'Organization',
          domains: ['example.com'],
          id: '1',
          name: 'Example Organization',
        },
      },
    });
  });
}
