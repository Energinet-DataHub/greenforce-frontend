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
import { GetSettlementReportCalculationsByGridAreasQuery } from '@energinet-datahub/dh/shared/domain/graphql';

export const mockSettlementReportCalculationsByGridAreas: GetSettlementReportCalculationsByGridAreasQuery =
  {
    __typename: 'Query',
    settlementReportGridAreaCalculationsForPeriod: [
      {
        __typename: 'KeyValuePairOfStringAndListOfRequestSettlementReportGridAreaCalculation',
        key: '002',
        value: [
          {
            __typename: 'RequestSettlementReportGridAreaCalculation',
            calculationDate: new Date('2022-12-09T23:00:00Z'),
            calculationId: '8ff516a1-95b0-4f07-9b58-3fb94791casd',
            gridAreaWithName: {
              __typename: 'GridAreaDto',
              code: '002',
              displayName: '002 • Gul netvirksomhed',
            },
          },
          {
            __typename: 'RequestSettlementReportGridAreaCalculation',
            calculationDate: new Date('2022-12-01T23:00:00Z'),
            calculationId: '911d0c33-3232-49e1-00aa-bcef313d1098',
            gridAreaWithName: {
              __typename: 'GridAreaDto',
              code: '002',
              displayName: '002 • Gul netvirksomhed',
            },
          },
        ],
      },
    ],
  };
