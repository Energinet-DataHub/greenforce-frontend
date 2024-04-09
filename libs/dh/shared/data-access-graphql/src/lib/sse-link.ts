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
import { ApolloLink, Operation, FetchResult, Observable } from '@apollo/client/core';
import { print } from 'graphql';
import { Client } from 'graphql-sse';

export default class SSELink extends ApolloLink {
  constructor(private client: Client) {
    super();
  }

  public override request = (op: Operation): Observable<FetchResult> =>
    new Observable((sink) => this.client.subscribe({ ...op, query: print(op.query) }, sink));
}
