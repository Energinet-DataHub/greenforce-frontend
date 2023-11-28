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
import { GetGridAreaOverviewQuery } from '@energinet-datahub/dh/shared/domain/graphql';

export const getGridAreaOverviewMock: GetGridAreaOverviewQuery = {
  __typename: 'Query',
  gridAreaOverview: [
    {
      __typename: 'GridAreaOverviewItemDto',
      code: '003',
      id: '3',
      name: 'Grid Area 3',
      priceAreaCode: 'DK1',
      actorName: 'Actor 3',
      actorNumber: '123456783',
      organizationName: 'Org 3',
      validFrom: new Date('2021-08-15T12:30:00'),
      validTo: null,
      fullFlexDate: new Date('2021-08-16T12:30:00'),
    },
    {
      __typename: 'GridAreaOverviewItemDto',
      code: '001',
      id: '1',
      name: 'Grid Area 1',
      priceAreaCode: 'DK1',
      actorName: 'Actor 1',
      actorNumber: '123456781',
      organizationName: 'Org 1',
      validFrom: new Date('2021-08-17T12:30:00'),
      validTo: null,
      fullFlexDate: new Date('2021-08-18T12:30:00'),
    },
    {
      __typename: 'GridAreaOverviewItemDto',
      code: '002',
      id: '2',
      name: 'Grid Area 1',
      priceAreaCode: 'DK1',
      actorName: 'Actor 2',
      actorNumber: '123456782',
      organizationName: 'Org 2',
      validFrom: new Date('2021-08-14T12:30:00'),
      validTo: null,
      fullFlexDate: new Date('2021-08-14T12:30:00'),
    },
    {
      __typename: 'GridAreaOverviewItemDto',
      code: '004',
      id: '4',
      name: 'Grid Area 4',
      priceAreaCode: 'DK1',
      actorName: 'Actor 4',
      actorNumber: '123456784',
      organizationName: 'Org 4',
      validFrom: new Date('2021-08-15T12:30:00'),
      validTo: null,
      fullFlexDate: new Date('2021-08-16T12:30:00'),
    },
    {
      __typename: 'GridAreaOverviewItemDto',
      code: '005',
      id: '5',
      name: 'Grid Area 5',
      priceAreaCode: 'DK1',
      actorName: 'Actor 5',
      actorNumber: '123456785',
      organizationName: 'Org 5',
      validFrom: new Date('2021-08-17T12:30:00'),
      validTo: null,
      fullFlexDate: new Date('2021-08-18T12:30:00'),
    },
    {
      __typename: 'GridAreaOverviewItemDto',
      code: '006',
      id: '6',
      name: 'Grid Area 6',
      priceAreaCode: 'DK1',
      actorName: 'Actor 6',
      actorNumber: '123456786',
      organizationName: 'Org 6',
      validFrom: new Date('2021-08-19T12:30:00'),
      validTo: null,
      fullFlexDate: new Date('2021-08-20T12:30:00'),
    },
  ],
};
