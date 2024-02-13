/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  GetUserProfileQuery,
  UpdateUserProfileMutation,
  mockGetUserProfileQuery,
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
  return mockGetUserProfileQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        userProfile: {
          __typename: 'GetUserProfileResponse',
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '+45 23344434',
          email: 'mock@energinet.dk',
        },
      } as GetUserProfileQuery,
    });
  });
}
