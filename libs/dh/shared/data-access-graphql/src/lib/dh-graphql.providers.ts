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
import { makeEnvironmentProviders } from '@angular/core';
import { APOLLO_FLAGS, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import {
  InMemoryCache,
  ApolloLink,
  Operation,
  split,
  ApolloClientOptions,
} from '@apollo/client/core';
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';
import { getMainDefinition } from '@apollo/client/utilities';

import {
  DhApiEnvironment,
  dhApiEnvironmentToken,
  environment,
} from '@energinet-datahub/dh/shared/environments';
import { DhApplicationInsights } from '@energinet-datahub/dh/shared/util-application-insights';
import { scalarTypePolicies } from '@energinet-datahub/dh/shared/domain/graphql';

import { errorHandler } from './error-handler';
import DhSseLink from './dh-sse-link';

function isSubscriptionQuery(operation: Operation) {
  const definition = getMainDefinition(operation.query);
  return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
}

export const graphQLProviders = makeEnvironmentProviders([
  {
    provide: APOLLO_FLAGS,
    useValue: {
      useInitialLoading: true,
      useMutationLoading: true,
    },
  },
  {
    provide: APOLLO_OPTIONS,
    useFactory(
      httpLink: HttpLink,
      sseLink: DhSseLink,
      dhApiEnvironment: DhApiEnvironment,
      dhApplicationInsights: DhApplicationInsights
    ): ApolloClientOptions<unknown> {
      if (environment.production === false) {
        loadDevMessages();
        loadErrorMessages();
      }
      return {
        defaultOptions: {
          query: {
            notifyOnNetworkStatusChange: true,
          },
          watchQuery: {
            notifyOnNetworkStatusChange: true,
          },
        },
        cache: new InMemoryCache({
          typePolicies: {
            ...scalarTypePolicies,
            MessageDelegationType: {
              keyFields: ['id', 'periodId'],
            },
            Query: {
              fields: {
                calculationById(_, { args, toReference }) {
                  return toReference({
                    __typename: 'Calculation',
                    id: args?.['id'],
                  });
                },
                actorById(_, { args, toReference }) {
                  return toReference({
                    __typename: 'Actor',
                    id: args?.['id'],
                  });
                },
              },
            },
          },
        }),
        link: ApolloLink.from([
          errorHandler(dhApplicationInsights),
          split(
            isSubscriptionQuery,
            sseLink.create(`${dhApiEnvironment.apiBase}/graphql?ngsw-bypass=true`),
            httpLink.create({
              uri: (operation: Operation) => {
                return `${dhApiEnvironment.apiBase}/graphql?${operation.operationName}`;
              },
            })
          ),
        ]),
      };
    },
    deps: [HttpLink, DhSseLink, dhApiEnvironmentToken, DhApplicationInsights],
  },
]);
