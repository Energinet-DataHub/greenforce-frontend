import {
  CalculationType,
  GetSettlementReportsQuery,
  SettlementReportStatusType,
} from '@energinet-datahub/dh/shared/domain/graphql';

const periodStart = new Date('2021-12-01T23:00:00Z');
const periodEnd = new Date('2021-12-02T23:00:00Z');

export const wholesaleSettlementReportsQueryMock: GetSettlementReportsQuery = {
  __typename: 'Query',
  settlementReports: [
    {
      __typename: 'SettlementReport',
      id: '1',
      calculationType: CalculationType.BalanceFixing,
      period: { start: periodStart, end: periodEnd },
      numberOfGridAreasInReport: 1,
      includesBaseData: true,
      statusType: SettlementReportStatusType.Completed,
      actor: {
        __typename: 'Actor',
        id: '1',
        name: 'Sort Strøm',
      },
    },
    {
      __typename: 'SettlementReport',
      id: '2',
      calculationType: CalculationType.Aggregation,
      period: { start: periodStart, end: periodEnd },
      numberOfGridAreasInReport: 2,
      includesBaseData: true,
      statusType: SettlementReportStatusType.InProgress,
      actor: {
        __typename: 'Actor',
        id: '2',
        name: 'Hvid Strøm',
      },
    },
    {
      __typename: 'SettlementReport',
      id: '3',
      calculationType: CalculationType.WholesaleFixing,
      period: { start: periodStart, end: periodEnd },
      numberOfGridAreasInReport: 3,
      includesBaseData: true,
      statusType: SettlementReportStatusType.Error,
      actor: {
        __typename: 'Actor',
        id: '3',
        name: 'Blå Strøm',
      },
    },
  ],
};
