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
  DocumentStatus,
  ExchangeEventCalculationType,
  EsettOutgoingMessage,
  EsettTimeSeriesType,
  PriceAreaCode,
  GridAreaType,
  GridAreaStatus,
} from '@energinet-datahub/dh/shared/domain/graphql';
import dayjs from 'dayjs';

const period = {
  start: dayjs('2020-01-28T23:00:00.000Z').toDate(),
  end: dayjs('2020-01-29T22:59:59.998Z').toDate(),
};

const lastDispatched = dayjs().date(1).hour(14).minute(23).toDate();

export function eSettDetailedExchangeEvents(apiBase: string): EsettOutgoingMessage[] {
  return [
    {
      __typename: 'EsettOutgoingMessage',
      documentId: '390161908',
      lastDispatched,
      gridArea: {
        __typename: 'GridAreaDto',
        code: '805',
        name: 'N1 A/S',
        displayName: '805 • N1 A/S',
        priceAreaCode: PriceAreaCode.Dk1,
        id: '1',
        validTo: null,
        validFrom: new Date(),
        includedInCalculation: true,
        type: GridAreaType.Distribution,
        status: GridAreaStatus.Active,
      },
      calculationType: ExchangeEventCalculationType.Aggregation,
      documentStatus: DocumentStatus.Accepted,
      timeSeriesType: EsettTimeSeriesType.Consumption,
      created: new Date('2021-01-01T00:10:00.000Z'),
      period,
      responseDocumentUrl: `${apiBase}/v1/EsettExchange/ResponseDocument`,
      dispatchDocumentUrl: `${apiBase}/v1/EsettExchange/DispatchDocument`,
      manuallyHandledExchangeEventMetaData: null,
    },
    {
      __typename: 'EsettOutgoingMessage',
      documentId: '390161909',
      lastDispatched,
      gridArea: {
        __typename: 'GridAreaDto',
        code: '806',
        name: 'N2 A/S',
        displayName: '806 • N2 A/S',
        priceAreaCode: PriceAreaCode.Dk2,
        id: '2',
        validTo: null,
        validFrom: new Date(),
        includedInCalculation: true,
        type: GridAreaType.Distribution,
        status: GridAreaStatus.Active,
      },
      calculationType: ExchangeEventCalculationType.Aggregation,
      documentStatus: DocumentStatus.Rejected,
      timeSeriesType: EsettTimeSeriesType.Consumption,
      created: new Date('2021-02-01T00:10:00.000Z'),
      period,
      responseDocumentUrl: `${apiBase}/v1/EsettExchange/ResponseDocument`,
      dispatchDocumentUrl: `${apiBase}/v1/EsettExchange/DispatchDocument`,
      manuallyHandledExchangeEventMetaData: null,
    },
    {
      __typename: 'EsettOutgoingMessage',
      documentId: '390161910',
      lastDispatched,
      gridArea: {
        __typename: 'GridAreaDto',
        code: '806',
        name: 'N2 A/S',
        displayName: '806 • N2 A/S',
        priceAreaCode: PriceAreaCode.Dk2,
        id: '2',
        validTo: null,
        validFrom: new Date(),
        includedInCalculation: true,
        type: GridAreaType.Distribution,
        status: GridAreaStatus.Active,
      },
      calculationType: ExchangeEventCalculationType.Aggregation,
      documentStatus: DocumentStatus.AwaitingReply,
      timeSeriesType: EsettTimeSeriesType.Consumption,
      created: new Date('2022-01-01T00:10:00.000Z'),
      period,
      responseDocumentUrl: `${apiBase}/v1/EsettExchange/ResponseDocument`,
      dispatchDocumentUrl: `${apiBase}/v1/EsettExchange/DispatchDocument`,
      manuallyHandledExchangeEventMetaData: null,
    },
    {
      __typename: 'EsettOutgoingMessage',
      documentId: '390161911',
      lastDispatched,
      gridArea: {
        __typename: 'GridAreaDto',
        code: '807',
        name: 'N3 A/S',
        displayName: '807 • N3 A/S',
        priceAreaCode: PriceAreaCode.Dk2,
        id: '3',
        validTo: null,
        validFrom: new Date(),
        includedInCalculation: true,
        type: GridAreaType.Distribution,
        status: GridAreaStatus.Active,
      },
      calculationType: ExchangeEventCalculationType.BalanceFixing,
      documentStatus: DocumentStatus.ManuallyHandled,
      timeSeriesType: EsettTimeSeriesType.Consumption,
      created: new Date('2023-01-01T00:10:00.000Z'),
      period,
      responseDocumentUrl: `${apiBase}/v1/EsettExchange/ResponseDocument`,
      dispatchDocumentUrl: `${apiBase}/v1/EsettExchange/DispatchDocument`,
      manuallyHandledExchangeEventMetaData: {
        __typename: 'ManuallyHandledExchangeEventMetaData',
        comment: 'Test comment3',
        manuallyHandledAt: new Date('2023-01-01T00:10:00.000Z'),
        manuallyHandledByIdentityDisplayName: 'Test User',
      },
    },
  ];
}
