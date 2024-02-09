import {
  GetUserProfileQuery,
  mockGetUserProfileQuery,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { mswConfig } from '@energinet-datahub/gf/util-msw';
import { HttpResponse, delay } from 'msw';

export function userProfileMocks() {
  return [getUserProfileQuery()];
}

function getUserProfileQuery() {
  return mockGetUserProfileQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        userProfile: {
          __typename: 'GetUserProfileResponse',
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '12345678',
          email: 'mock@energinet.dk',
        },
      } as GetUserProfileQuery,
    });
  });
}
