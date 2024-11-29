import { delay, http, HttpResponse } from 'msw';

import { mswConfig } from '@energinet-datahub/gf/util-msw';
import { mockInitiateMitIdSignupMutation } from '@energinet-datahub/dh/shared/domain/graphql';

import { marketParticipantUserActors } from './data/market-participant-user-actors';

export function marketParticipantUserMocks(apiBase: string) {
  return [getActors(apiBase), postInitiateMitIdSignup()];
}

function getActors(apiBase: string) {
  return http.get(`${apiBase}/v1/MarketParticipantUser/GetUserActors`, async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json(marketParticipantUserActors, { status: 200 });
  });
}

function postInitiateMitIdSignup() {
  return mockInitiateMitIdSignupMutation(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        initiateMitIdSignup: {
          __typename: 'InitiateMitIdSignupPayload',
          success: true,
          errors: [],
        },
      },
    });
  });
}
