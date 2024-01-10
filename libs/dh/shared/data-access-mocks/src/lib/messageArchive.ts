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
import { http, HttpResponse } from 'msw';

import actors from './data/messageArchiveActors.json';
import { messageArchiveSearchResponseLogs } from './data/messageArchiveSearchResponseLogs';
import { document } from './data/message-archived-document';

export function messageArchiveMocks(apiBase: string) {
  return [archivedMessageSearch(apiBase), getActors(apiBase), getDocument(apiBase)];
}

export function archivedMessageSearch(apiBase: string) {
  return http.post(`${apiBase}/v1/MessageArchive/SearchRequestResponseLogs`, () => {
      return HttpResponse.json(messageArchiveSearchResponseLogs, { status: 200 });
  });
}

export function getActors(apiBase: string) {
  return http.get(`${apiBase}/v1/MessageArchive/Actors`, () => {
      return HttpResponse.json(actors, { status: 200 });
  });
}

export function getDocument(apiBase: string) {
  return http.get(`${apiBase}/v1/MessageArchive/:id/Document`, async () => {
      return HttpResponse.json(document, { status: 200 });
  });
}
