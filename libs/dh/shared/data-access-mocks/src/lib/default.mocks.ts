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
import { http, HttpResponse } from 'msw';

export function defaultMocks(apiBase: string) {
  return [eventStream(apiBase)];
}

function eventStream(apiBase: string) {
  return http.post(`${apiBase}/graphql`, (x) => {
    if (x.request.headers.get('accept') !== 'text/event-stream') return;
    return new HttpResponse(new ReadableStream(), {
      headers: {
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream',
      },
    });
  });
}
