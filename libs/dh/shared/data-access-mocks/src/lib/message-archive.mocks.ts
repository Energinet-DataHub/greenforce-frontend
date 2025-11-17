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
import { DefaultBodyType, delay, http, HttpResponse, StrictResponse } from 'msw';

import { mswConfig } from '@energinet-datahub/gf/util-msw';
import { DocumentType, ProcessState } from '@energinet-datahub/dh/shared/domain/graphql';
import {
  mockGetArchivedMessagesQuery,
  mockGetArchivedMessagesForMeteringPointQuery,
  mockGetMeteringPointProcessOverviewQuery,
  mockGetMeteringPointProcessByIdQuery,
} from '@energinet-datahub/dh/shared/domain/graphql/msw';

import { messageArchiveSearchResponseLogs } from './data/message-archive-search-response-logs';
import { document, documentJson } from './data/message-archived-document';

export function messageArchiveMocks(apiBase: string) {
  return [
    getDocumentById(apiBase),
    getArchivedMessages(apiBase),
    getArchivedMessagesForMeteringPoint(apiBase),
    getMeteringPointProcessOverview(),
    getMeteringPointProcessById(apiBase),
  ];
}

export function getDocumentById(apiBase: string) {
  return http.get(
    `${apiBase}/v1/MessageArchive/Document`,
    async (): Promise<StrictResponse<DefaultBodyType>> => {
      await delay(mswConfig.delay);
      const random = Math.floor(Math.random() * 1000);
      return random % 2 === 0
        ? HttpResponse.text(document, { headers: { 'Content-Type': 'text/xml' } })
        : HttpResponse.json(documentJson, { headers: { 'Content-Type': 'application/json' } });
    }
  );
}

function getArchivedMessages(apiBase: string) {
  return mockGetArchivedMessagesQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        archivedMessages: {
          __typename: 'ArchivedMessagesConnection',
          pageInfo: {
            __typename: 'PageInfo',
            startCursor: 'startCursor',
            endCursor: 'endCursor',
          },
          totalCount: messageArchiveSearchResponseLogs.messages.length,
          nodes: messageArchiveSearchResponseLogs.messages.map((m) => ({
            __typename: 'ArchivedMessage',
            id: m.id,
            messageId: m.messageId,
            documentType: m.documentType,
            receiver: {
              __typename: 'MarketParticipant',
              id: '8698f30b-5e9d-4f70-9e8b-ce79d8b1b303',
              glnOrEicNumber: m.receiverGln ?? '',
              displayName: 'Energinet DataHub',
            },
            sender: {
              __typename: 'MarketParticipant',
              id: '8698f30b-5e9d-4f70-9e8b-ce79d8b1b303',
              glnOrEicNumber: m.senderGln ?? '',
              displayName: 'Energinet DataHub',
            },
            createdAt: m.createdDate ? new Date(m.createdDate) : new Date(),
            documentUrl: `${apiBase}/v1/MessageArchive/Document?id=${m.id}`,
          })),
        },
      },
    });
  });
}

function getArchivedMessagesForMeteringPoint(apiBase: string) {
  return mockGetArchivedMessagesForMeteringPointQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        archivedMessagesForMeteringPoint: {
          __typename: 'ArchivedMessagesForMeteringPointConnection',
          pageInfo: {
            __typename: 'PageInfo',
            startCursor: 'startCursor',
            endCursor: 'endCursor',
          },
          totalCount: messageArchiveSearchResponseLogs.messages.length,
          nodes: messageArchiveSearchResponseLogs.messages.map((m) => ({
            __typename: 'ArchivedMessage',
            id: m.id,
            messageId: m.messageId,
            documentType: DocumentType.SendMeasurements,
            receiver: {
              __typename: 'MarketParticipant',
              id: '8698f30b-5e9d-4f70-9e8b-ce79d8b1b303',
              glnOrEicNumber: m.receiverGln ?? '',
              displayName: 'Energinet DataHub',
            },
            sender: {
              __typename: 'MarketParticipant',
              id: '8698f30b-5e9d-4f70-9e8b-ce79d8b1b303',
              glnOrEicNumber: m.senderGln ?? '',
              displayName: 'Energinet DataHub',
            },
            createdAt: m.createdDate ? new Date(m.createdDate) : new Date(),
            documentUrl: `${apiBase}/v1/MessageArchive/Document?id=${m.id}`,
          })),
        },
      },
    });
  });
}

function getMeteringPointProcessOverview() {
  return mockGetMeteringPointProcessOverviewQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPointProcessOverview: {
          __typename: 'MeteringPointProcessOverviewConnection',
          pageInfo: {
            __typename: 'PageInfo',
            startCursor: 'startCursor',
            endCursor: 'endCursor',
          },
          totalCount: messageArchiveSearchResponseLogs.messages.length,
          nodes: messageArchiveSearchResponseLogs.messages.map((m, index) => ({
            __typename: 'MeteringPointProcess',
            id: m.id,
            reasonCode: ['MoveIn', 'BalanceFixing', 'WholesaleFixing', 'EndOfSupply'][index % 4],
            createdAt: m.createdDate ? new Date(m.createdDate) : new Date(),
            cutoffDate: m.createdDate ? new Date(m.createdDate) : new Date(),
            state: ProcessState.Succeeded,
            initiator: {
              __typename: 'MarketParticipant',
              id: '0199ed3d-f1b2-7180-9546-39b5836fb575',
              displayName: '905495045940594 • Radius',
            },
          })),
        },
      },
    });
  });
}

function getMeteringPointProcessById(apiBase: string) {
  return mockGetMeteringPointProcessByIdQuery(async (args) => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPointProcessById: messageArchiveSearchResponseLogs.messages
          .map((m, index) => ({
            __typename: 'MeteringPointProcess' as const,
            id: m.id,
            createdAt: m.createdDate ? new Date(m.createdDate) : new Date(),
            cutoffDate: m.createdDate ? new Date(m.createdDate) : new Date(),
            state: ProcessState.Succeeded,
            reasonCode: ['MoveIn', 'BalanceFixing', 'WholesaleFixing', 'EndOfSupply'][index % 4],
            initiator: {
              __typename: 'MarketParticipant' as const,
              id: '0199ed3d-f1b2-7180-9546-39b5836fb575',
              displayName: '905495045940594 • Radius',
            },
            steps: [
              {
                __typename: 'MeteringPointProcessStep' as const,
                id: '0199ed3d-f1b2-7180-9546-39b5836fb575',
                step: 'REQUEST_END_OF_SUPPLY',
                comment: 'OBS: Sendt til foged',
                createdAt: new Date(m.createdDate),
                dueDate: new Date(m.createdDate),
                state: ProcessState.Succeeded,
                messageId: '38374f50-f00c-4e2a-aec1-70d391cade06',
                message: {
                  __typename: 'ArchivedMessage' as const,
                  id: '38374f50-f00c-4e2a-aec1-70d391cade06',
                  documentUrl: `${apiBase}/v1/MessageArchive/Document?id=38374f50-f00c-4e2a-aec1-70d391cade06`,
                },
                actor: {
                  __typename: 'MarketParticipant' as const,
                  id: '0199ed3d-f1b2-7180-9546-39b5836fb575',
                  name: 'Radius',
                },
              },
            ],
          }))
          .find((p) => p.id === args.variables.id),
      },
    });
  });
}
