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
import { inject, Injectable } from '@angular/core';
import { ApolloClient, ApolloLink, Operation, split } from '@apollo/client/core';
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';
import { getMainDefinition } from '@apollo/client/utilities';

import { dhApiEnvironmentToken } from '@energinet-datahub/dh/shared/environments';

import { cache } from './dh-apollo-cache';
import { DhErrorLink } from './dh-error-link';
import { DhHttpLink } from './dh-http-link';
import { DhRetryLink } from './dh-retry-link';
import { DhSseLink } from './dh-sse-link';

declare const ngDevMode: boolean;

if (ngDevMode) {
  loadDevMessages();
  loadErrorMessages();
}

/** Returns true if the operation is a subscription. */
function isSubscription(operation: Operation) {
  const definition = getMainDefinition(operation.query);
  return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
}

/**
 * Minimal Apollo service for Angular.
 * Provides access to the ApolloClient instance.
 *
 * Usage:
 *   const apollo = inject(DhApollo);
 *   apollo.client.query({ query: MyDocument });
 *   apollo.client.mutate({ mutation: MyMutation });
 *   apollo.client.subscribe({ query: MySubscription });
 */
@Injectable({ providedIn: 'root' })
export class DhApollo {
  private readonly environment = inject(dhApiEnvironmentToken);
  private readonly errorLink = inject(DhErrorLink);
  private readonly retryLink = inject(DhRetryLink);
  private readonly httpLink = inject(DhHttpLink);
  private readonly sseLink = inject(DhSseLink);

  readonly client = new ApolloClient({
    cache,
    defaultOptions: {
      query: { notifyOnNetworkStatusChange: true },
      watchQuery: { notifyOnNetworkStatusChange: true },
    },
    link: ApolloLink.from([
      this.retryLink.create(),
      this.errorLink.create(),
      split(
        isSubscription,
        this.sseLink.create(`${this.environment.apiBase}/graphql?ngsw-bypass=true`),
        this.httpLink.create(`${this.environment.apiBase}/graphql`)
      ),
    ]),
  });
}
