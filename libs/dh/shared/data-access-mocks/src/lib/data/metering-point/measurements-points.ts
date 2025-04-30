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
  MeasurementPointDto,
  Quality,
  Resolution,
  Unit,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const measurementPoints: MeasurementPointDto[] = [
  {
    __typename: 'MeasurementPointDto',
    order: 1,
    persistedTime: new Date('2023-01-01T00:00:00Z'),
    registrationTime: new Date('2023-01-01T00:00:00Z'),
    quality: Quality.Calculated,
    quantity: 23,
    resolution: Resolution.Hourly,
    unit: Unit.KWh,
  },
  {
    __typename: 'MeasurementPointDto',
    order: 2,
    persistedTime: new Date('2023-01-01T01:00:00Z'),
    registrationTime: new Date('2023-01-01T00:00:00Z'),
    quality: Quality.Estimated,
    quantity: 3,
    resolution: Resolution.Hourly,
    unit: Unit.KWh,
  },
  {
    __typename: 'MeasurementPointDto',
    order: 3,
    persistedTime: new Date('2023-01-01T02:00:00Z'),
    registrationTime: new Date('2023-01-01T00:00:00Z'),
    quality: Quality.Calculated,
    quantity: 2,
    resolution: Resolution.Hourly,
    unit: Unit.KWh,
  },
  {
    __typename: 'MeasurementPointDto',
    order: 4,
    persistedTime: new Date('2023-01-01T03:00:00Z'),
    registrationTime: new Date('2023-01-01T00:00:00Z'),
    quality: Quality.Estimated,
    quantity: 4,
    resolution: Resolution.Hourly,
    unit: Unit.KWh,
  },
  {
    __typename: 'MeasurementPointDto',
    order: 5,
    persistedTime: new Date('2023-01-01T04:00:00Z'),
    registrationTime: new Date('2023-01-01T00:00:00Z'),
    quality: Quality.Calculated,
    quantity: 34,
    resolution: Resolution.Hourly,
    unit: Unit.KWh,
  },
  {
    __typename: 'MeasurementPointDto',
    order: 6,
    persistedTime: new Date('2023-01-01T05:00:00Z'),
    registrationTime: new Date('2023-01-01T00:00:00Z'),
    quality: Quality.Estimated,
    quantity: 0,
    resolution: Resolution.Hourly,
    unit: Unit.KWh,
  },
];
