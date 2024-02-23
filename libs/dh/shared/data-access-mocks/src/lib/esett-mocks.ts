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
import { delay, http, HttpResponse } from 'msw';
import {
  mockGetOutgoingMessagesQuery,
  mockGetOutgoingMessageByIdQuery,
  mockGetBalanceResponsibleMessagesQuery,
  mockGetServiceStatusQuery,
  mockGetMeteringGridAreaImbalanceQuery,
  mockGetStatusReportQuery,
  mockResendExchangeMessagesMutation,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { mswConfig } from '@energinet-datahub/gf/util-msw';

import { eSettExchangeEvents } from './data/esett-exchange-events';
import { eSettDetailedExchangeEvents } from './data/esett-detailed-exchange-events';
import { eSettBalanceResponsibleMessages } from './data/esett-balance-responsible-messages';
import { mgaImbalanceSearchResponseQueryMock } from './data/esett/mga-imbalance-search-response-query';
import { serviceStatusQueryMock } from './data/esett/service-status-query';
import { statusReportQueryMock } from './data/esett/status-report-query';
import { resendMessageMutationMock } from './data/esett/resend-messages-mutation';

export function eSettMocks(apiBase: string) {
  return [
    getOutgoingMessagesQuery(),
    getOutgoingMessageByIdQuery(),
    getResponseDocument(apiBase),
    getDispatchDocument(apiBase),
    getBalanceResponsibleMessagesQuery(),
    getMeteringGridAreaImbalanceQuery(),
    getStorageDocumentLink(apiBase),
    getMgaImbalanceDocument(apiBase),
    getServiceStatusQuery(),
    getStatusReportQuery(),
    resendMessageMutation(),
  ];
}

const base64Document =
  'PEFnZ3JlZ2F0ZWRQcm9kdWN0aW9uUGVyTUdBRm9yU2V0dGxlbWVudEZvclNldHRsZW1lbnRSZXNwb25zaWJsZSB4bWxucz0idW46dW5lY2U6MjYwOmRhdGE6RUVNLUFnZ3JlZ2F0ZWRQcm9kdWN0aW9uUGVyTUdBRm9yU2V0dGxlbWVudEZvclNldHRsZW1lbnRSZXNwb25zaWJsZSI+CiAgPEhlYWRlcj4KICAgIDxJZGVudGlmaWNhdGlvbj4zNEI3RTQ0NDM1MTI0NkE4QjRDNzlBMEE3NTgzMDg5Qy0wPC9JZGVudGlmaWNhdGlvbj4KICAgIDxEb2N1bWVudFR5cGUgbGlzdEFnZW5jeUlkZW50aWZpZXI9IjI2MCI+RTMxPC9Eb2N1bWVudFR5cGU+CiAgICA8Q3JlYXRpb24+MjAyMy0wNi0xOVQyMDozNDoyMlo8L0NyZWF0aW9uPgogICAgPFNlbmRlckVuZXJneVBhcnR5PgogICAgICA8SWRlbnRpZmljYXRpb24gc2NoZW1lQWdlbmN5SWRlbnRpZmllcj0iOSI+NTc5MDAwMTMzMDU1MjwvSWRlbnRpZmljYXRpb24+CiAgICA8L1NlbmRlckVuZXJneVBhcnR5PgogICAgPFJlY2lwaWVudEVuZXJneVBhcnR5PgogICAgICA8SWRlbnRpZmljYXRpb24gc2NoZW1lQWdlbmN5SWRlbnRpZmllcj0iMzA1Ij40NFgtMDAwMDAwMDAwMDRCPC9JZGVudGlmaWNhdGlvbj4KICAgIDwvUmVjaXBpZW50RW5lcmd5UGFydHk+CiAgPC9IZWFkZXI+CiAgPFByb2Nlc3NFbmVyZ3lDb250ZXh0PgogICAgPEVuZXJneUJ1c2luZXNzUHJvY2VzcyBsaXN0QWdlbmN5SWRlbnRpZmllcj0iMjYwIj5FNDQ8L0VuZXJneUJ1c2luZXNzUHJvY2Vzcz4KICAgIDxFbmVyZ3lCdXNpbmVzc1Byb2Nlc3NSb2xlIGxpc3RBZ2VuY3lJZGVudGlmaWVyPSIzMzAiPkREWDwvRW5lcmd5QnVzaW5lc3NQcm9jZXNzUm9sZT4KICAgIDxFbmVyZ3lJbmR1c3RyeUNsYXNzaWZpY2F0aW9uIGxpc3RBZ2VuY3lJZGVudGlmaWVyPSIzMzAiPjIzPC9FbmVyZ3lJbmR1c3RyeUNsYXNzaWZpY2F0aW9uPgogIDwvUHJvY2Vzc0VuZXJneUNvbnRleHQ+CiAgPFBheWxvYWRFbmVyZ3lUaW1lU2VyaWVzPgogICAgPElkZW50aWZpY2F0aW9uPjIyMzc4ODI2NTk3XzIzNzc5MzIwMDgyPC9JZGVudGlmaWNhdGlvbj4KICAgIDxSZWdpc3RyYXRpb25EYXRlVGltZT4yMDIzLTA2LTE5VDIwOjM0OjIyWjwvUmVnaXN0cmF0aW9uRGF0ZVRpbWU+CiAgICA8T2JzZXJ2YXRpb25QZXJpb2RUaW1lU2VyaWVzUGVyaW9kPgogICAgICA8UmVzb2x1dGlvbkR1cmF0aW9uPlBUMTVNPC9SZXNvbHV0aW9uRHVyYXRpb24+CiAgICAgIDxTdGFydD4yMDIzLTA2LTA2VDIyOjAwOjAwWjwvU3RhcnQ+CiAgICAgIDxFbmQ+MjAyMy0wNi0wN1QyMjowMDowMFo8L0VuZD4KICAgIDwvT2JzZXJ2YXRpb25QZXJpb2RUaW1lU2VyaWVzUGVyaW9kPgogICAgPEJhbGFuY2VTdXBwbGllckludm9sdmVkRW5lcmd5UGFydHk+CiAgICAgIDxJZGVudGlmaWNhdGlvbiBzY2hlbWVBZ2VuY3lJZGVudGlmaWVyPSI5Ij41NzkwMDAyNDE2OTI3PC9JZGVudGlmaWNhdGlvbj4KICAgIDwvQmFsYW5jZVN1cHBsaWVySW52b2x2ZWRFbmVyZ3lQYXJ0eT4KICAgIDxQcm9kdWN0SW5jbHVkZWRQcm9kdWN0Q2hhcmFjdGVyaXN0aWM+CiAgICAgIDxJZGVudGlmaWNhdGlvbiBzY2hlbWVBZ2VuY3lJZGVudGlmaWVyPSI5Ij44NzE2ODY3MDAwMDMwPC9JZGVudGlmaWNhdGlvbj4KICAgICAgPFVuaXRUeXBlIGxpc3RBZ2VuY3lJZGVudGlmaWVyPSIzMzAiPktXSDwvVW5pdFR5cGU+CiAgICA8L1Byb2R1Y3RJbmNsdWRlZFByb2R1Y3RDaGFyYWN0ZXJpc3RpYz4KICAgIDxNUERldGFpbE1lYXN1cmVtZW50TWV0ZXJpbmdQb2ludENoYXJhY3RlcmlzdGljPgogICAgICA8TWV0ZXJpbmdQb2ludFR5cGUgbGlzdEFnZW5jeUlkZW50aWZpZXI9IjI2MCI+RTE4PC9NZXRlcmluZ1BvaW50VHlwZT4KICAgICAgPFNldHRsZW1lbnRNZXRob2RUeXBlIGxpc3RBZ2VuY3lJZGVudGlmaWVyPSIyNjAiPkUwMjwvU2V0dGxlbWVudE1ldGhvZFR5cGU+CiAgICAgIDxCdXNpbmVzc1R5cGUgbGlzdEFnZW5jeUlkZW50aWZpZXI9IjMzMCI+QTAxPC9CdXNpbmVzc1R5cGU+CiAgICAgIDxBc3NldFR5cGUgbGlzdEFnZW5jeUlkZW50aWZpZXI9IjMzMCI+QjIwPC9Bc3NldFR5cGU+CiAgICAgIDxQcm9kdWN0aW9uVHlwZSBsaXN0QWdlbmN5SWRlbnRpZmllcj0iMzMwIj5aMDE8L1Byb2R1Y3Rpb25UeXBlPgogICAgPC9NUERldGFpbE1lYXN1cmVtZW50TWV0ZXJpbmdQb2ludENoYXJhY3RlcmlzdGljPgogICAgPE1ldGVyaW5nR3JpZEFyZWFVc2VkRG9tYWluTG9jYXRpb24+CiAgICAgIDxJZGVudGlmaWNhdGlvbiBzY2hlbWVJZGVudGlmaWVyPSJESyIgc2NoZW1lQWdlbmN5SWRlbnRpZmllcj0iMjYwIj4zODQ8L0lkZW50aWZpY2F0aW9uPgogICAgPC9NZXRlcmluZ0dyaWRBcmVhVXNlZERvbWFpbkxvY2F0aW9uPgogICAgPE9ic2VydmF0aW9uSW50ZXJ2YWxPYnNlcnZhdGlvblBlcmlvZD4KICAgICAgPFNlcXVlbmNlPjE8L1NlcXVlbmNlPgogICAgICA8T2JzZXJ2YXRpb25EZXRhaWxFbmVyZ3lPYnNlcnZhdGlvbj4KICAgICAgICA8RW5lcmd5UXVhbnRpdHk+MC4wMTwvRW5lcmd5UXVhbnRpdHk+CiAgICAgIDwvT2JzZXJ2YXRpb25EZXRhaWxFbmVyZ3lPYnNlcnZhdGlvbj4KICAgIDwvT2JzZXJ2YXRpb25JbnRlcnZhbE9ic2VydmF0aW9uUGVyaW9kPgogICAgPE9ic2VydmF0aW9uSW50ZXJ2YWxPYnNlcnZhdGlvblBlcmlvZD4KICAgICAgPFNlcXVlbmNlPjI8L1NlcXVlbmNlPgogICAgICA8T2JzZXJ2YXRpb25EZXRhaWxFbmVyZ3lPYnNlcnZhdGlvbj4KICAgICAgICA8RW5lcmd5UXVhbnRpdHk+MC4wMDE8L0VuZXJneVF1YW50aXR5PgogICAgICA8L09ic2VydmF0aW9uRGV0YWlsRW5lcmd5T2JzZXJ2YXRpb24+CiAgICA8L09ic2VydmF0aW9uSW50ZXJ2YWxPYnNlcnZhdGlvblBlcmlvZD4KICA8L1BheWxvYWRFbmVyZ3lUaW1lU2VyaWVzPgo8L0FnZ3JlZ2F0ZWRQcm9kdWN0aW9uUGVyTUdBRm9yU2V0dGxlbWVudEZvclNldHRsZW1lbnRSZXNwb25zaWJsZT4=';

function getResponseDocument(apiBase: string) {
  return http.get(`${apiBase}/v1/EsettExchange/ResponseDocument`, async () => {
    await delay(mswConfig.delay);
    return HttpResponse.arrayBuffer(
      Uint8Array.from(
        atob(
          'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPEFja25vd2xlZGdlbWVudERvY3VtZW50IHhtbG5zPSJ1cm46ZW50c29lLmV1OndnZWRpOmFja25vd2xlZGdlbWVudDphY2tub3dsZWRnZW1lbnRkb2N1bWVudDo2OjAiPgogICAgPERvY3VtZW50SWRlbnRpZmljYXRpb24gdj0iZGQxZTg1YTIwZDkzNDc3MjlkNDU3ODM2MjY4ZGJmZDMiIC8+CiAgICA8RG9jdW1lbnREYXRlVGltZSB2PSIyMDIzLTA5LTA3VDA0OjMzOjMyWiIgLz4KICAgIDxTZW5kZXJJZGVudGlmaWNhdGlvbiB2PSI0NFgtMDAwMDAwMDAwMDRCIiBjb2RpbmdTY2hlbWU9IkEwMSIgLz4KICAgIDxTZW5kZXJSb2xlIHY9IkEwNSIgLz4KICAgIDxSZWNlaXZlcklkZW50aWZpY2F0aW9uIHY9IjU3OTAwMDI2MDY4OTIiIGNvZGluZ1NjaGVtZT0iQTEwIiAvPgogICAgPFJlY2VpdmVyUm9sZSB2PSJBMDkiIC8+CiAgICA8UmVjZWl2aW5nRG9jdW1lbnRJZGVudGlmaWNhdGlvbiB2PSI0MDM4NzQ5MzMiIC8+CiAgICA8UmVjZWl2aW5nRG9jdW1lbnRUeXBlIHY9IkUzMSIgLz4KICAgIDxSZWFzb24+CiAgICAgICAgPFJlYXNvbkNvZGUgdj0iQTAxIiAvPgogICAgPC9SZWFzb24+CjwvQWNrbm93bGVkZ2VtZW50RG9jdW1lbnQ+'
        ),
        (c) => c.charCodeAt(0)
      )
    );
  });
}

function getDispatchDocument(apiBase: string) {
  return http.get(`${apiBase}/v1/EsettExchange/DispatchDocument`, async () => {
    await delay(mswConfig.delay);
    return HttpResponse.arrayBuffer(Uint8Array.from(atob(base64Document), (c) => c.charCodeAt(0)));
  });
}

function getStorageDocumentLink(apiBase: string) {
  return http.get(`${apiBase}/v1/EsettExchange/StorageDocument`, async () => {
    await delay(mswConfig.delay);
    return HttpResponse.arrayBuffer(Uint8Array.from(atob(base64Document), (c) => c.charCodeAt(0)));
  });
}

function getMgaImbalanceDocument(apiBase: string) {
  return http.get(`${apiBase}/v1/EsettExchange/MgaImbalanceDocument`, async () => {
    await delay(mswConfig.delay);
    return HttpResponse.arrayBuffer(Uint8Array.from(atob(base64Document), (c) => c.charCodeAt(0)));
  });
}

function getOutgoingMessageByIdQuery() {
  return mockGetOutgoingMessageByIdQuery(async ({ variables }) => {
    const id = variables.documentId;
    const esettOutgoingMessageById = eSettDetailedExchangeEvents.find((x) => x.documentId === id);
    await delay(mswConfig.delay);
    return esettOutgoingMessageById
      ? HttpResponse.json({ data: { __typename: 'Query', esettOutgoingMessageById } })
      : HttpResponse.json({ data: null }, { status: 404 });
  });
}

function getOutgoingMessagesQuery() {
  return mockGetOutgoingMessagesQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        esettExchangeEvents: {
          __typename: 'ExchangeEventSearchResponse',
          totalCount: eSettExchangeEvents.length,
          items: eSettExchangeEvents,
        },
      },
    });
  });
}

function getBalanceResponsibleMessagesQuery() {
  return mockGetBalanceResponsibleMessagesQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        balanceResponsible: {
          __typename: 'BalanceResponsiblePageResult',
          totalCount: eSettBalanceResponsibleMessages.length,
          page: eSettBalanceResponsibleMessages,
        },
      },
    });
  });
}

function getMeteringGridAreaImbalanceQuery() {
  return mockGetMeteringGridAreaImbalanceQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: mgaImbalanceSearchResponseQueryMock,
    });
  });
}

function getServiceStatusQuery() {
  return mockGetServiceStatusQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: serviceStatusQueryMock,
    });
  });
}

function getStatusReportQuery() {
  return mockGetStatusReportQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: statusReportQueryMock,
    });
  });
}

function resendMessageMutation() {
  return mockResendExchangeMessagesMutation(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: resendMessageMutationMock,
    });
  });
}
