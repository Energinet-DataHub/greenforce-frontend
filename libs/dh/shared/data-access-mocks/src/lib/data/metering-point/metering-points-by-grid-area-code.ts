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
import {
  MeteringPointDto,
  MeteringPointsGroupByPackageNumber,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const meteringPointsByGridAreaCode: MeteringPointsGroupByPackageNumber[] = [
  {
    __typename: 'MeteringPointsGroupByPackageNumber',
    packageNumber: '1',
    meteringPoints: [
      {
        __typename: 'MeteringPointDto',
        id: 1,
        meteringPointId: '111111111111111111',
      } as MeteringPointDto,
      {
        __typename: 'MeteringPointDto',
        id: 2,
        meteringPointId: '222222222222222222',
      } as MeteringPointDto,
    ],
  },
  {
    __typename: 'MeteringPointsGroupByPackageNumber',
    packageNumber: '2',
    meteringPoints: [
      {
        __typename: 'MeteringPointDto',
        id: 3,
        meteringPointId: '333333333333333333',
      } as MeteringPointDto,
      {
        __typename: 'MeteringPointDto',
        id: 4,
        meteringPointId: '444444444444444444',
      } as MeteringPointDto,
      {
        __typename: 'MeteringPointDto',
        id: 5,
        meteringPointId: '555555555555555555',
      } as MeteringPointDto,
    ],
  },
];
