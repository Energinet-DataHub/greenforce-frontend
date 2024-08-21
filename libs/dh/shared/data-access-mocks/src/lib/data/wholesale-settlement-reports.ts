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
  CalculationType,
  GetSettlementReportsQuery,
  SettlementReportStatusType,
} from '@energinet-datahub/dh/shared/domain/graphql';

const periodStart = new Date('2021-12-01T23:00:00Z');
const periodEnd = new Date('2021-12-02T23:00:00Z');

export const wholesaleSettlementReportsQueryMock = (
  apiBase: string
): GetSettlementReportsQuery => ({
  __typename: 'Query',
  settlementReports: [
    {
      __typename: 'SettlementReport',
      id: '1',
      calculationType: CalculationType.BalanceFixing,
      period: { start: periodStart, end: periodEnd },
      numberOfGridAreasInReport: 1,
      includesBasisData: true,
      statusType: SettlementReportStatusType.Completed,
      progress: 100,
      actor: {
        __typename: 'Actor',
        id: '1',
        name: 'Sort Strøm',
      },
      settlementReportDownloadUrl: `${apiBase}/v1/WholesaleSettlementReport/DownloadReport`,
    },
    {
      __typename: 'SettlementReport',
      id: '2',
      calculationType: CalculationType.Aggregation,
      period: { start: periodStart, end: periodEnd },
      numberOfGridAreasInReport: 2,
      includesBasisData: true,
      statusType: SettlementReportStatusType.Completed,
      progress: 45.25,
      actor: {
        __typename: 'Actor',
        id: '2',
        name: 'Hvid Strøm',
      },
      settlementReportDownloadUrl: `${apiBase}/v1/WholesaleSettlementReport/DownloadReport`,
    },
    {
      __typename: 'SettlementReport',
      id: '3',
      calculationType: CalculationType.WholesaleFixing,
      period: { start: periodStart, end: periodEnd },
      numberOfGridAreasInReport: 3,
      includesBasisData: true,
      statusType: SettlementReportStatusType.Error,
      progress: 75,
      actor: {
        __typename: 'Actor',
        id: '3',
        name: 'Blå Strøm',
      },
      settlementReportDownloadUrl: `${apiBase}/v1/WholesaleSettlementReport/DownloadReport`,
    },
  ],
});
