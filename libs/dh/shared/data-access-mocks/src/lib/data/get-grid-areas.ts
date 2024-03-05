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
import { GetGridAreasQuery } from '@energinet-datahub/dh/shared/domain/graphql';

export const getGridAreas: GetGridAreasQuery = {
  __typename: 'Query',
  gridAreas: [
    {
      id: '4ee13230-3716-468f-96ee-01b15f054530',
      code: '001',
      name: 'Grid area 1',
      validFrom: new Date(),
      validTo: null,
      __typename: 'GridAreaDto',
    },
    {
      id: '89801ec1-af12-46d9-b044-05a004a0d46c',
      code: '002',
      name: 'Grid area 2',
      validFrom: new Date(),
      validTo: null,
      __typename: 'GridAreaDto',
    },
    {
      id: 'd45f9498-1954-4c7d-8e9c-0d4a2aba058b',
      code: '003',
      name: 'Grid area 3',
      validFrom: new Date(),
      validTo: null,
      __typename: 'GridAreaDto',
    },
  ],
};
