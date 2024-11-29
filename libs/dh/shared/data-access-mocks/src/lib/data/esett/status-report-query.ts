import { GetStatusReportQuery } from '@energinet-datahub/dh/shared/domain/graphql';

export const statusReportQueryMock: GetStatusReportQuery = {
  __typename: 'Query',
  esettExchangeStatusReport: {
    __typename: 'ExchangeEventStatusReportResponse',
    waitingForExternalResponse: 5,
  },
};
