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
  WholesaleAndEnergyCalculationType,
  GetSettlementReportsQuery,
  SettlementReportStatusType,
} from '@energinet-datahub/dh/shared/domain/graphql';

const periodStart = new Date('2021-12-01T23:00:00Z');
const periodEnd = new Date('2021-12-02T23:00:00Z');

const executionTimeStart = new Date('2024-09-11T06:12:00Z');

const executionTimeEnd_Days = new Date('2024-09-12T17:15:00Z');
const executionTimeEnd_Hours = new Date('2024-09-11T14:44:00Z');
const executionTimeEnd_Minutes = new Date('2024-09-11T06:48:00Z');
const executionTimeEnd_Seconds = new Date('2024-09-11T06:12:42Z');

export const wholesaleSettlementReportsQueryMock = (
  apiBase: string
): GetSettlementReportsQuery => ({
  __typename: 'Query',
  settlementReports: [
    {
      __typename: 'SettlementReport',
      id: '85d1798474654be1b8c2f5bc543ed111',
      calculationType: WholesaleAndEnergyCalculationType.BalanceFixing,
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
      executionTime: {
        start: executionTimeStart,
        end: executionTimeEnd_Days,
      },
      settlementReportDownloadUrl: `${apiBase}/v1/WholesaleSettlementReport/DownloadReport`,
      includeMonthlyAmount: true,
      combineResultInASingleFile: true,
      gridAreas: ['003', '004', '005', '006', '007'],
    },
    {
      __typename: 'SettlementReport',
      id: '85d1798474654be1b8c2f5bc543ed222',
      calculationType: WholesaleAndEnergyCalculationType.Aggregation,
      period: { start: periodStart, end: periodEnd },
      numberOfGridAreasInReport: 2,
      includesBasisData: true,
      statusType: SettlementReportStatusType.InProgress,
      progress: 45.25,
      actor: {
        __typename: 'Actor',
        id: '2',
        name: 'Hvid Strøm',
      },
      executionTime: {
        start: executionTimeStart,
        end: executionTimeEnd_Hours,
      },
      settlementReportDownloadUrl: `${apiBase}/v1/WholesaleSettlementReport/DownloadReport`,
      includeMonthlyAmount: false,
      combineResultInASingleFile: true,
      gridAreas: ['100', '101', '102'],
    },
    {
      __typename: 'SettlementReport',
      id: '85d1798474654be1b8c2f5bc543ed333',
      calculationType: WholesaleAndEnergyCalculationType.WholesaleFixing,
      period: { start: periodStart, end: periodEnd },
      numberOfGridAreasInReport: 0,
      includesBasisData: true,
      statusType: SettlementReportStatusType.Completed,
      progress: 75,
      actor: {
        __typename: 'Actor',
        id: '3',
        name: 'Blå Strøm',
      },
      executionTime: {
        start: executionTimeStart,
        end: executionTimeEnd_Minutes,
      },
      settlementReportDownloadUrl: `${apiBase}/v1/WholesaleSettlementReport/DownloadReport`,
      includeMonthlyAmount: true,
      combineResultInASingleFile: false,
      gridAreas: [],
    },
    {
      __typename: 'SettlementReport',
      id: '85d1798474654be1b8c2f5bc543ed444',
      calculationType: WholesaleAndEnergyCalculationType.ThirdCorrectionSettlement,
      period: { start: periodStart, end: periodEnd },
      numberOfGridAreasInReport: 15,
      includesBasisData: false,
      statusType: SettlementReportStatusType.Error,
      progress: 50,
      actor: {
        __typename: 'Actor',
        id: '3',
        name: 'Blå Strøm',
      },
      executionTime: {
        start: executionTimeStart,
        end: executionTimeEnd_Seconds,
      },
      settlementReportDownloadUrl: `${apiBase}/v1/WholesaleSettlementReport/DownloadReport`,
      includeMonthlyAmount: false,
      combineResultInASingleFile: false,
      gridAreas: [
        '700',
        '701',
        '702',
        '703',
        '704',
        '705',
        '706',
        '707',
        '708',
        '709',
        '710',
        '711',
        '712',
        '713',
        '714',
        '715',
        '716',
        '718',
      ],
    },
    {
      __typename: 'SettlementReport',
      id: '85d1798474654be1b8c2f5bc543ed555',
      calculationType: WholesaleAndEnergyCalculationType.FirstCorrectionSettlement,
      period: { start: periodStart, end: null },
      numberOfGridAreasInReport: 42,
      includesBasisData: false,
      statusType: SettlementReportStatusType.InProgress,
      progress: 15,
      actor: {
        __typename: 'Actor',
        id: '3',
        name: 'Blå Strøm',
      },
      executionTime: {
        start: executionTimeStart,
        end: null,
      },
      settlementReportDownloadUrl: `${apiBase}/v1/WholesaleSettlementReport/DownloadReport`,
      includeMonthlyAmount: true,
      combineResultInASingleFile: true,
      gridAreas: [],
    },
  ],
});
