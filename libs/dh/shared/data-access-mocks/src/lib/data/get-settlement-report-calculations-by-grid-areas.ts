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
            calculationDate: new Date('2022-12-01T23:00:00Z'),
            calculationId: '8ff516a1-95b0-4f07-9b58-3fb94791casd',
            gridAreaWithName: {
              __typename: 'GridAreaDto',
              id: '00000000-0000-0000-0000-000000000002',
              code: '002',
              displayName: '002 • Gul netvirksomhed',
            },
          },
          {
            __typename: 'RequestSettlementReportGridAreaCalculation',
            calculationDate: new Date('2022-12-09T23:00:00Z'),
            calculationId: '911d0c33-3232-49e1-00aa-bcef313d1098',
            gridAreaWithName: {
              __typename: 'GridAreaDto',
              id: '00000000-0000-0000-0000-000000000002',
              code: '002',
              displayName: '002 • Gul netvirksomhed',
            },
          },
        ],
      },
    ],
  };
