import {
  UserProfileQuery,
  UpdateUserProfileMutation,
  mockUserProfileQuery,
  mockUpdateUserProfileMutation,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { mswConfig } from '@energinet-datahub/gf/util-msw';
import { HttpResponse, delay } from 'msw';

export function userProfileMocks() {
  return [getUserProfileQuery(), updatUserProfileMutation()];
}

function updatUserProfileMutation() {
  return mockUpdateUserProfileMutation(
    async ({
      variables: {
        input: { userProfileUpdateDto },
      },
    }) => {
      const response: UpdateUserProfileMutation = {
        __typename: 'Mutation',
        updateUserProfile: {
          __typename: 'UpdateUserProfilePayload',
          errors: null,
          saved: true,
        },
      };

      const errorResponse: UpdateUserProfileMutation = {
        __typename: 'Mutation',
        updateUserProfile: {
          __typename: 'UpdateUserProfilePayload',
          errors: [
            {
              __typename: 'ApiError',
              apiErrors: [
                {
                  __typename: 'ApiErrorDescriptor',
                  code: 'market_participant.bad_argument.missing_required_value',
                  message: 'missing_required_value',
                  args: ['firstName'],
                },
              ],
            },
          ],
          saved: false,
        },
      };

      await delay(mswConfig.delay);

      return HttpResponse.json({
        data: userProfileUpdateDto.firstName === 'error' ? errorResponse : response,
      });
    }
  );
}

function getUserProfileQuery() {
  return mockUserProfileQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        userProfile: {
          __typename: 'GetUserProfileResponse',
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '+46 123000001',
          email: 'mock@energinet.dk',
          hasFederatedLogin: Math.random() > 0.5,
        },
      } as UserProfileQuery,
    });
  });
}
