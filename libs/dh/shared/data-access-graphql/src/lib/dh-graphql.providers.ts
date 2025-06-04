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
import { inject } from '@angular/core';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink, Operation, split } from '@apollo/client/core';
import { RetryLink } from '@apollo/client/link/retry';
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';
import { getMainDefinition } from '@apollo/client/utilities';

import { dhApiEnvironmentToken } from '@energinet-datahub/dh/shared/environments';
import { DhApplicationInsights } from '@energinet-datahub/dh/shared/util-application-insights';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { scalarTypePolicies } from '@energinet-datahub/dh/shared/domain/graphql';
import introspection from '@energinet-datahub/dh/shared/domain/graphql/introspection';

import { errorHandler } from './error-handler';
import DhSseLink from './dh-sse-link';
import { HttpErrorResponse } from '@angular/common/http';

declare const ngDevMode: boolean;

function isSubscriptionQuery(operation: Operation) {
  const definition = getMainDefinition(operation.query);
  return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export const graphQLProvider = provideApollo(() => {
  const httpLink = inject(HttpLink);
  const sseLink = inject(DhSseLink);
  const dhApiEnvironment = inject(dhApiEnvironmentToken);
  const dhApplicationInsights = inject(DhApplicationInsights);

  if (ngDevMode) {
    loadDevMessages();
    loadErrorMessages();
  }

  // Configure retry link for release toggles and other queries
  const retryLink = new RetryLink({
    delay: {
      initial: 1000, // Start with 1 second delay
      max: 30000, // Max 30 seconds between retries
      jitter: true, // Add randomness to prevent thundering herd
    },
    attempts: {
      max: 10, // Maximum retry attempts
      retryIf: (error, operation) => {
        if (!error) return false;

        const shouldRetry = determineIfShouldRetry(error);

        // Log retry attempts to Application Insights
        if (shouldRetry) {
          const attempt = (operation.getContext().retryCount || 0) + 1;
          dhApplicationInsights.trackException(
            new Error(
              `GraphQL retry attempt ${attempt}/10 for ${operation.operationName}: ${getErrorMessage(error)}`
            ),
            SeverityLevel.Warning
          );

          // Log critical error if we've hit max retries
          if (attempt >= 10) {
            dhApplicationInsights.trackException(
              new Error(
                `GraphQL operation ${operation.operationName} failed after maximum retries`
              ),
              SeverityLevel.Critical
            );
          }
        }

        return shouldRetry;
      },
    },
  });

  function determineIfShouldRetry(error: HttpErrorResponse): boolean {
    // Handle Angular HttpErrorResponse (what we get from blocked requests)
    if (error.status !== undefined) {
      const status = error.status;
      return status === 0 || status >= 500;
    }

    // Handle other HttpErrorResponse types by name or message
    return error.name === 'HttpErrorResponse' || error.message?.includes('Http failure');
  }

  function getErrorMessage(error: HttpErrorResponse): string {
    if (error.message) return error.message;
    if (error.status !== undefined)
      return `HTTP ${error.status}: ${error.statusText || 'Unknown Error'}`;
    return JSON.stringify(error);
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
      possibleTypes: introspection.possibleTypes,
      typePolicies: {
        ...scalarTypePolicies,
        MessageDelegationType: {
          keyFields: ['id', 'periodId'],
        },
        ActorUserRole: {
          keyFields: false,
        },
        Calculation: {
          keyFields: (obj) => `Calculation:${obj.id}`,
        },
        Query: {
          fields: {
            calculationById(_, { args, toReference }) {
              return toReference({
                __typename: 'Calculation',
                id: args?.id,
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
      retryLink,
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
});
