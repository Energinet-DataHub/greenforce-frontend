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

import { mockGetOrganizationEditQuery } from '@energinet-datahub/dh/shared/domain/graphql/msw';
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
