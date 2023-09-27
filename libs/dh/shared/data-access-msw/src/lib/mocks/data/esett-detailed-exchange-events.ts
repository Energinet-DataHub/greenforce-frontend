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
  EsettOutgoingMessage,
  TimeSeriesType,
  PriceAreaCode,
} from '@energinet-datahub/dh/shared/domain/graphql';

const getDispatchDocumentLink =
  'https://localhost:5001/v1/EsettExchange/DispatchDocument?documentId=390254675-3';
const getResponseDocumentLink =
  'https://localhost:5001/v1/EsettExchange/ResponseDocument?documentId=390254675-3';

export const eSettDetailedExchangeEvents: EsettOutgoingMessage[] = [
  {
    __typename: 'EsettOutgoingMessage',
    documentId: '390161908',
    gridArea: {
      __typename: 'GridAreaDto',
      code: '805',
      name: 'N1 A/S',
      priceAreaCode: PriceAreaCode.Dk1,
      id: '1',
      validTo: null,
      validFrom: new Date(),
    },
    processType: ExchangeEventProcessType.Aggregation,
    documentStatus: DocumentStatus.Accepted,
    timeSeriesType: TimeSeriesType.Consumption,
    created: new Date('2021-01-01T00:10:00.000Z'),
    periodFrom: new Date('2021-01-01T00:00:00.000Z'),
    periodTo: new Date('2021-03-01T00:00:00.000Z'),
    getDispatchDocumentLink,
    getResponseDocumentLink,
  },
  {
    __typename: 'EsettOutgoingMessage',
    documentId: '390161909',
    gridArea: {
      __typename: 'GridAreaDto',
      code: '806',
      name: 'N2 A/S',
      priceAreaCode: PriceAreaCode.Dk2,
      id: '2',
      validTo: null,
      validFrom: new Date(),
    },
    processType: ExchangeEventProcessType.Aggregation,
    documentStatus: DocumentStatus.Rejected,
    timeSeriesType: TimeSeriesType.Consumption,
    created: new Date('2021-02-01T00:10:00.000Z'),
    periodFrom: new Date('2021-02-01T00:00:00.000Z'),
    periodTo: new Date('2021-05-01T00:00:00.000Z'),
    getDispatchDocumentLink,
    getResponseDocumentLink,
  },
  {
    __typename: 'EsettOutgoingMessage',
    documentId: '390161910',
    gridArea: {
      __typename: 'GridAreaDto',
      code: '806',
      name: 'N2 A/S',
      priceAreaCode: PriceAreaCode.Dk2,
      id: '2',
      validTo: null,
      validFrom: new Date(),
    },
    processType: ExchangeEventProcessType.Aggregation,
    documentStatus: DocumentStatus.AwaitingReply,
    timeSeriesType: TimeSeriesType.Consumption,
    created: new Date('2022-01-01T00:10:00.000Z'),
    periodFrom: new Date('2022-01-01T00:00:00.000Z'),
    periodTo: new Date('2022-03-01T00:00:00.000Z'),
    getDispatchDocumentLink,
    getResponseDocumentLink,
  },
  {
    __typename: 'EsettOutgoingMessage',
    documentId: '390161911',
    gridArea: {
      __typename: 'GridAreaDto',
      code: '806',
      name: 'N2 A/S',
      priceAreaCode: PriceAreaCode.Dk2,
      id: '2',
      validTo: null,
      validFrom: new Date(),
    },
    processType: ExchangeEventProcessType.Aggregation,
    documentStatus: DocumentStatus.AwaitingReply,
    timeSeriesType: TimeSeriesType.Consumption,
    created: new Date('2023-01-01T00:10:00.000Z'),
    periodFrom: new Date('2023-01-01T00:00:00.000Z'),
    periodTo: new Date('2023-03-01T00:00:00.000Z'),
    getDispatchDocumentLink,
    getResponseDocumentLink,
  },
];
