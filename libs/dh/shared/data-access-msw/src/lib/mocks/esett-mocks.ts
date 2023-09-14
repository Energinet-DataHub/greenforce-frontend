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
  DocumentStatus,
  ExchangeEventProcessType,
  ExchangeEventSearchResultType,
  ExchangeEventTrackingResultType,
  TimeSeriesType,
  mockGetOutgoingMessagesQuery,
  mockGetOutgoingMessageByIdQuery,
} from '@energinet-datahub/dh/shared/domain/graphql';

const exchangeEvents: ExchangeEventSearchResultType[] = [
  {
    documentId: '390161908',
    gridAreaCode: '805',
    processType: ExchangeEventProcessType.Aggregation,
    documentStatus: DocumentStatus.Accepted,
    timeSeriesType: TimeSeriesType.Consumption,
  },

  {
    documentId: '390161909',
    gridAreaCode: '806',
    processType: ExchangeEventProcessType.BalanceFixing,
    documentStatus: DocumentStatus.Rejected,
    timeSeriesType: TimeSeriesType.Production,
  },
];

const detailedEsettExchangeEvents: ExchangeEventTrackingResultType[] = [
  {
    documentId: '390161908',
    gridAreaCode: '805 - N1 A/S',
    processType: ExchangeEventProcessType.Aggregation,
    documentStatus: DocumentStatus.Accepted,
    timeSeriesType: TimeSeriesType.Consumption,
    created: new Date('2021-01-01T00:10:00.000Z'),
    periodFrom: new Date('2021-01-01T00:00:00.000Z'),
    periodTo: new Date('2021-03-01T00:00:00.000Z'),
  },
  {
    documentId: '390161909',
    gridAreaCode: '806 - N2 A/S',
    processType: ExchangeEventProcessType.Aggregation,
    documentStatus: DocumentStatus.Accepted,
    timeSeriesType: TimeSeriesType.Consumption,
    created: new Date('2021-01-01T00:10:00.000Z'),
    periodFrom: new Date('2021-01-01T00:00:00.000Z'),
    periodTo: new Date('2021-03-01T00:00:00.000Z'),
  },
];

export function eSettMocks() {
  return [getActorsForSettlementReportQuery(), getOutgoingMessageByIdQuery()];
}

function getOutgoingMessageByIdQuery() {
  return mockGetOutgoingMessageByIdQuery((req, res, ctx) => {
    const documentId = req.variables.documentId;
    return res(
      ctx.delay(300),
      ctx.data({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        esettExchangeEvent: detailedEsettExchangeEvents.find((x) => x.documentId === documentId)!,
      })
    );
  });
}

function getActorsForSettlementReportQuery() {
  return mockGetOutgoingMessagesQuery((req, res, ctx) => {
    return res(
      ctx.delay(300),
      ctx.data({
        esettExchangeEvents: {
          totalCount: exchangeEvents.length,
          items: exchangeEvents,
        },
      })
    );
  });
}
