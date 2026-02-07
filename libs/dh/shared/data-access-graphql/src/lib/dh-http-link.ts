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
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HttpLink } from '@apollo/client/core';
import { firstValueFrom, map } from 'rxjs';

/** Maps Angular `HttpResponse` to a fetch `Response`. */
function toResponse(response: HttpResponse<string>) {
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers(
      response.headers
        .keys()
        .flatMap((k) => response.headers.getAll(k)?.map((v): [string, string] => [k, v]) ?? [])
    ),
  });
}

@Injectable({ providedIn: 'root' })
export class DhHttpLink {
  private httpClient = inject(HttpClient);
  create = (uri: string) =>
    new HttpLink({
      uri: (operation) => `${uri}?${operation.operationName}`,
      fetch: async (input, options) =>
        firstValueFrom(
          this.httpClient
            .post(input.toString(), options?.body, {
              headers: new HttpHeaders(new Headers(options?.headers)),
              observe: 'response',
              responseType: 'text',
            })
            .pipe(map(toResponse))
        ),
    });
}
