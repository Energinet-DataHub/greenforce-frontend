//#region License
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
//#endregion
import { HttpResponse, delay } from 'msw';

import {
  mockGetOrganizationByIdQuery,
  mockGetOrganizationEditQuery,
  mockGetOrganizationFromCvrQuery,
  mockGetOrganizationsQuery,
  mockUpdateOrganizationMutation,
} from '@energinet-datahub/dh/shared/domain/graphql/msw';
import { mswConfig } from '@energinet-datahub/gf/util-msw';
import { getOrganizationsQueryMock } from './data/market-participant-organizations';
import {
  Organization,
  UpdateOrganizationMutation,
} from '@energinet-datahub/dh/shared/domain/graphql';

export function organizationMocks() {
  return [
    organizationEditMock(),
    getOrganizations(),
    getOrganizationById(),
    getOrganizationFromCvr(),
    updateOrganization(),
  ];
}

function getOrganizations() {
  return mockGetOrganizationsQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: getOrganizationsQueryMock,
    });
  });
}

function updateOrganization() {
  return mockUpdateOrganizationMutation(async () => {
    const response: UpdateOrganizationMutation = {
      __typename: 'Mutation',
      updateOrganization: {
        __typename: 'UpdateOrganizationPayload',
        errors: null,
      },
    };

    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: response,
    });
  });
}

function getOrganizationById() {
  return mockGetOrganizationByIdQuery(async ({ variables }) => {
    const { id } = variables;

    const organizationById = {
      ...getOrganizationsQueryMock.organizations.find((a) => a.id === id),
      address: {
        __typename: 'AddressDto',
        country: 'DK',
      },
    } as Organization;
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: { __typename: 'Query', organizationById },
    });
  });
}

function getOrganizationFromCvr() {
  return mockGetOrganizationFromCvrQuery(async ({ variables }) => {
    const noResultCVR = '00000000';

    const { cvr } = variables;

    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        searchOrganizationInCVR: {
          __typename: 'CVROrganizationResult',
          name: noResultCVR === cvr ? '' : 'Test Organization',
          hasResult: noResultCVR !== cvr,
        },
      },
    });
  });
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
