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
  GetOrganizationsQuery,
  OrganizationStatus,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const getOrganizationsQueryMock: GetOrganizationsQuery = {
  __typename: 'Query',
  organizations: [
    {
      __typename: 'OrganizationDto',
      organizationId: 'b3bdd441-4f22-3f33-b88f-08da5f288474',
      businessRegisterIdentifier: '12345677',
      name: 'Sort Strøm',
      status: OrganizationStatus.Active,
    },
    {
      __typename: 'OrganizationDto',
      organizationId: '23f2fca9-2b4b-1150-99e9-08dbc66e2700',
      businessRegisterIdentifier: '99990115',
      name: 'Hvid Strøm',
      status: OrganizationStatus.New,
    },
  ],
};
