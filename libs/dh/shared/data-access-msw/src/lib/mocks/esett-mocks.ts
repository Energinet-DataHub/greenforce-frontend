import { mockGetOutgoingMessagesQuery } from '@energinet-datahub/dh/shared/domain/graphql';

export function eSettMocks() {
  return [getActorsForSettlementReportQuery()];
}

function getActorsForSettlementReportQuery() {
  return mockGetOutgoingMessagesQuery((req, res, ctx) => {
    return res(ctx.delay(300), ctx.data({ esettExchangeEvents: { items: [], totalCount: 0 } }));
  });
}
