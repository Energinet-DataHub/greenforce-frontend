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
import { InMemoryCache, ApolloLink, ApolloClient, ErrorLike } from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';
import { getMainDefinition } from '@apollo/client/utilities';
import { ServerError } from '@apollo/client/errors';

import { dhApiEnvironmentToken } from '@energinet-datahub/dh/shared/environments';
import { DhApplicationInsights } from '@energinet-datahub/dh/shared/util-application-insights';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { scalarTypePolicies } from '@energinet-datahub/dh/shared/domain/graphql';
import introspection from '@energinet-datahub/dh/shared/domain/graphql/introspection';

import { errorHandler } from './error-handler';
import DhSseLink from './dh-sse-link';

declare const ngDevMode: boolean;

function isSubscriptionQuery(operation: ApolloLink.Operation) {
  const definition = getMainDefinition(operation.query);
  return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export const graphQLProvider = provideApollo((): ApolloClient.Options => {
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
      initial: 1_000, // Start with 1 second delay
      max: 30_000, // Max 30 seconds between retries
      jitter: true, // Add randomness to prevent thundering herd
    },
    attempts: {
      max: 10, // Maximum retry attempts
      retryIf: (error: ErrorLike, operation) => {
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

  function determineIfShouldRetry(error: ErrorLike): boolean {
    // Use Apollo's ServerError.is() for reliable error type identification
    if (ServerError.is(error)) {
      const status = error.statusCode;

      // Don't retry status 0 errors (blocked requests, network offline, etc.)
      // These are unlikely to succeed on retry and cause long delays
      if (status === 0) return false;
      return status >= 500;
    }

    // Handle other error types by name or message
    const errorAny = error as { name?: string; message?: string };
    return (
      errorAny.name === 'HttpErrorResponse' || errorAny.message?.includes('Http failure') || false
    );
  }

  function getErrorMessage(error: ErrorLike): string {
    if (ServerError.is(error)) {
      if (error.message) return error.message;
      return `HTTP ${error.statusCode}: Unknown Error`;
    }
    const errorAny = error as { message?: string };
    if (errorAny.message) return errorAny.message;
    return JSON.stringify(error);
  }

  return {
    defaultOptions: {
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
        MarketParticipantUserRole: {
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
            chargeById(_, { args, toReference }) {
              return toReference({
                __typename: 'Charge',
                id: args?.id,
              });
            },
            meteringPointExists(_, { args, toReference }) {
              return toReference({
                __typename: 'MeteringPointDto',
                id: args?.internalMeteringPointId,
              });
            },
            meteringPointProcessById(_, { args, toReference }) {
              return toReference({
                __typename: 'MeteringPointProcess',
                id: args?.id,
              });
            },
            marketParticipantById(_, { args, toReference }) {
              return toReference({
                __typename: 'MarketParticipant',
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
      ApolloLink.split(
        isSubscriptionQuery,
        sseLink.create(`${dhApiEnvironment.apiBase}/graphql?ngsw-bypass=true`),
        httpLink.create({
          uri: (operation: ApolloLink.Operation) => {
            return `${dhApiEnvironment.apiBase}/graphql?${operation.operationName}`;
          },
        })
      ),
    ]),
  };
});
