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
  MeasurementPointV2,
  Quality,
  Resolution,
  Unit,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const measurementPoints: MeasurementPointV2[] = [
  {
    __typename: 'MeasurementPointV2',
    order: 1,
    created: new Date('2023-01-01T00:00:00Z'),
    quality: Quality.Calculated,
    quantity: 23,
    resolution: Resolution.Hour,
    unit: Unit.KWh,
  },
  {
    __typename: 'MeasurementPointV2',
    order: 2,
    created: new Date('2023-01-01T01:00:00Z'),
    quality: Quality.Calculated,
    quantity: 3,
    resolution: Resolution.Hour,
    unit: Unit.KWh,
  },
  {
    __typename: 'MeasurementPointV2',
    order: 3,
    created: new Date('2023-01-01T02:00:00Z'),
    quality: Quality.Calculated,
    quantity: 2,
    resolution: Resolution.Hour,
    unit: Unit.KWh,
  },
  {
    __typename: 'MeasurementPointV2',
    order: 4,
    created: new Date('2023-01-01T03:00:00Z'),
    quality: Quality.Calculated,
    quantity: 4,
    resolution: Resolution.Hour,
    unit: Unit.KWh,
  },
  {
    __typename: 'MeasurementPointV2',
    order: 5,
    created: new Date('2023-01-01T04:00:00Z'),
    quality: Quality.Calculated,
    quantity: 34,
    resolution: Resolution.Hour,
    unit: Unit.KWh,
  },
];
