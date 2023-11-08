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
  ExchangeEventCalculationType,
  ExchangeEventSearchResult,
  TimeSeriesType,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const eSettExchangeEvents: ExchangeEventSearchResult[] = [
  {
    __typename: 'ExchangeEventSearchResult',
    created: new Date(2023, 1, 1),
    documentId: '390161908',
    gridAreaCode: '805',
    calculationType: ExchangeEventCalculationType.Aggregation,
    documentStatus: DocumentStatus.Accepted,
    timeSeriesType: TimeSeriesType.Consumption,
  },
  {
    __typename: 'ExchangeEventSearchResult',
    created: new Date(2023, 1, 1),
    documentId: '390161909',
    gridAreaCode: '806',
    calculationType: ExchangeEventCalculationType.Aggregation,
    documentStatus: DocumentStatus.Rejected,
    timeSeriesType: TimeSeriesType.Production,
  },
  {
    __typename: 'ExchangeEventSearchResult',
    created: new Date(2023, 1, 1),
    documentId: '390161910',
    gridAreaCode: '806',
    calculationType: ExchangeEventCalculationType.Aggregation,
    documentStatus: DocumentStatus.AwaitingReply,
    timeSeriesType: TimeSeriesType.Production,
  },
  {
    __typename: 'ExchangeEventSearchResult',
    created: new Date(),
    documentId: '390161911',
    gridAreaCode: '806',
    calculationType: ExchangeEventCalculationType.BalanceFixing,
    documentStatus: DocumentStatus.AwaitingReply,
    timeSeriesType: TimeSeriesType.Production,
  },
];
