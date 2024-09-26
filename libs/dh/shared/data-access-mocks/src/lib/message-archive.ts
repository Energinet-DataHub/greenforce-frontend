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
import { DefaultBodyType, delay, http, HttpResponse, StrictResponse } from 'msw';

import { mswConfig } from '@energinet-datahub/gf/util-msw';

import { actors } from './data/message-archive-actors';
import { messageArchiveSearchResponseLogs } from './data/message-archive-search-response-logs';
import { document, documentJson } from './data/message-archived-document';
import {
  BusinessReason,
  BusinessTransaction,
  DocumentType,
  mockGetArchivedMessagesQuery,
} from '@energinet-datahub/dh/shared/domain/graphql';

export function messageArchiveMocks(apiBase: string) {
  return [
    archivedMessageSearch(apiBase),
    getActors(apiBase),
    getDocument(apiBase),
    getDocumentById(apiBase),
    getArchivedMessages(apiBase),
  ];
}

export function archivedMessageSearch(apiBase: string) {
  return http.post(`${apiBase}/v1/MessageArchive/SearchRequestResponseLogs`, async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json(messageArchiveSearchResponseLogs, { status: 200 });
  });
}

export function getActors(apiBase: string) {
  return http.get(`${apiBase}/v1/MessageArchive/Actors`, async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json(actors, { status: 200 });
  });
}

export function getDocument(apiBase: string) {
  return http.get(
    `${apiBase}/v1/MessageArchive/:id/Document`,
    async (): Promise<StrictResponse<DefaultBodyType>> => {
      await delay(mswConfig.delay);
      const random = Math.floor(Math.random() * 1000);
      return random % 2 === 0
        ? HttpResponse.text(document, { headers: { 'Content-Type': 'text/xml' } })
        : HttpResponse.json(documentJson, { headers: { 'Content-Type': 'application/json' } });
    }
  );
}

export function getDocumentById(apiBase: string) {
  return http.get(
    `${apiBase}/v1/MessageArchive/Document?id=:id`,
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
            documentType: m.documentType as DocumentType,
            receiver: {
              __typename: 'Actor',
              id: '8698f30b-5e9d-4f70-9e8b-ce79d8b1b303',
              glnOrEicNumber: m.receiverGln ?? '',
              displayName: 'Energinet DataHub',
            },
            sender: {
              __typename: 'Actor',
              id: '8698f30b-5e9d-4f70-9e8b-ce79d8b1b303',
              glnOrEicNumber: m.senderGln ?? '',
              displayName: 'Energinet DataHub',
            },
            createdAt: m.createdDate ? new Date(m.createdDate) : new Date(),
            documentUrl: `${apiBase}/v1/MessageArchive/Document?id=${m.id}`,
            businessTransaction: BusinessTransaction.Rsm016,
            businessReason: BusinessReason.D14,
          })),
        },
      },
    });
  });
}
