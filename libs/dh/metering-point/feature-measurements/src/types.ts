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
  GetMeasurementsDocument,
  GetMeasurementsQueryVariables,
  GetAggregatedMeasurementsForMonthDocument,
  GetAggregatedMeasurementsForYearDocument,
  GetAggregatedMeasurementsForMonthQueryVariables,
  GetAggregatedMeasurementsForYearQueryVariables,
  GetAggregatedMeasurementsForAllYearsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import type { ResultOf } from '@graphql-typed-document-node/core';

export type MeasurementPosition = ResultOf<
  typeof GetMeasurementsDocument
>['measurements']['measurementPositions'][0];

export type CurrentMeasurement = MeasurementPosition['current'];

export type MeasurementsQueryVariables = Partial<GetMeasurementsQueryVariables> & {
  showHistoricValues?: boolean;
};

export type AggregatedMeasurementsForMonth = ResultOf<
  typeof GetAggregatedMeasurementsForMonthDocument
>['aggregatedMeasurementsForMonth'][0];

export type AggregatedMeasurementsForYear = ResultOf<
  typeof GetAggregatedMeasurementsForYearDocument
>['aggregatedMeasurementsForYear'][0];

export type AggregatedMeasurementsForAllYears = ResultOf<
  typeof GetAggregatedMeasurementsForAllYearsDocument
>['aggregatedMeasurementsForAllYears'][0];

export type AggregatedMeasurementsByMonthQueryVariables =
  Partial<GetAggregatedMeasurementsForMonthQueryVariables>;
export type AggregatedMeasurementsByYearQueryVariables =
  Partial<GetAggregatedMeasurementsForYearQueryVariables>;
