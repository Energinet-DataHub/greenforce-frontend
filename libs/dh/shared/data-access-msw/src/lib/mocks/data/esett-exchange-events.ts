import {
  DocumentStatus,
  ExchangeEventProcessType,
  ExchangeEventSearchResult,
  TimeSeriesType,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const eSettExchangeEvents: ExchangeEventSearchResult[] = [
  {
    __typename: 'ExchangeEventSearchResult',
    created: new Date(2023, 1, 1),
    documentId: '390161908',
    gridAreaCode: '805',
    processType: ExchangeEventProcessType.Aggregation,
    documentStatus: DocumentStatus.Accepted,
    timeSeriesType: TimeSeriesType.Consumption,
  },
  {
    __typename: 'ExchangeEventSearchResult',
    created: new Date(2023, 1, 1),
    documentId: '390161909',
    gridAreaCode: '806',
    processType: ExchangeEventProcessType.BalanceFixing,
    documentStatus: DocumentStatus.Rejected,
    timeSeriesType: TimeSeriesType.Production,
  },
  {
    __typename: 'ExchangeEventSearchResult',
    created: new Date(2023, 1, 1),
    documentId: '390161910',
    gridAreaCode: '806',
    processType: ExchangeEventProcessType.BalanceFixing,
    documentStatus: DocumentStatus.AwaitingReply,
    timeSeriesType: TimeSeriesType.Production,
  },
  {
    __typename: 'ExchangeEventSearchResult',
    created: new Date(),
    documentId: '390161911',
    gridAreaCode: '806',
    processType: ExchangeEventProcessType.BalanceFixing,
    documentStatus: DocumentStatus.AwaitingReply,
    timeSeriesType: TimeSeriesType.Production,
  },
];
