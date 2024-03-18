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
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink, Operation } from '@apollo/client/core';
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';

import {
  DhApiEnvironment,
  dhApiEnvironmentToken,
  environment,
} from '@energinet-datahub/dh/shared/environments';
import { DhApplicationInsights } from '@energinet-datahub/dh/shared/util-application-insights';

import { errorHandler } from './error-handler';
import { makeEnvironmentProviders } from '@angular/core';
import { scalarTypePolicies } from '@energinet-datahub/dh/shared/domain/graphql';

export const graphQLProviders = makeEnvironmentProviders([
  {
    provide: APOLLO_OPTIONS,
    useFactory(
      httpLink: HttpLink,
      dhApiEnvironment: DhApiEnvironment,
      dhApplicationInsights: DhApplicationInsights
    ) {
      if (environment.production === false) {
        loadDevMessages();
        loadErrorMessages();
      }
      return {
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
          httpLink.create({
            uri: (operation: Operation) => {
              return `${dhApiEnvironment.apiBase}/graphql?${operation.operationName}`;
            },
          }),
        ]),
      };
    },
    deps: [HttpLink, dhApiEnvironmentToken, DhApplicationInsights],
  },
]);
