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
import { ErrorLink } from '@apollo/client/link/error';
import {
  CombinedGraphQLErrors,
  CombinedProtocolErrors,
  ServerError,
  ServerParseError,
} from '@apollo/client/errors';
import { GraphQLFormattedError } from 'graphql';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { DhApplicationInsights } from '@energinet-datahub/dh/shared/util-application-insights';

/**
 * Apollo Client Error Handler using ErrorLink
 *
 * Handles different error types according to Apollo Client best practices:
 * - CombinedGraphQLErrors: Server-side execution errors (syntax, validation, resolver errors)
 * - CombinedProtocolErrors: Fatal transport-level errors during multipart HTTP subscription execution
 * - ServerError: Server responds with non-200 HTTP status code
 * - ServerParseError: Server response cannot be parsed as valid JSON
 *
 * @see https://www.apollographql.com/docs/react/data/error-handling
 */
export const errorHandler = (logger: DhApplicationInsights) =>
  new ErrorLink(({ error, operation }) => {
    const operationName = operation.operationName || 'Unknown Operation';

    // Handle GraphQL errors (syntax, validation, resolver errors)
    if (CombinedGraphQLErrors.is(error)) {
      error.errors.forEach(({ message, extensions, path }) => {
        const errorDetails = extensions?.['details'] as string | undefined;
        const errorCode = extensions?.['code'] as string | undefined;
        const errorPath = path?.join('.') || 'unknown';

        logger.trackException(
          new Error(
            `[GraphQL Error] Operation: ${operationName}, Path: ${errorPath}, Code: ${errorCode || 'N/A'}, Message: ${errorDetails || message}`
          ),
          SeverityLevel.Error
        );
      });
      return;
    }

    // Handle protocol errors (multipart subscription transport errors)
    if (CombinedProtocolErrors.is(error)) {
      error.errors.forEach(({ message }) => {
        logger.trackException(
          new Error(`[Protocol Error] Operation: ${operationName}, Message: ${message}`),
          SeverityLevel.Error
        );
      });
      return;
    }

    // Handle server HTTP errors (non-200 status codes)
    if (ServerError.is(error)) {
      logger.trackException(
        new Error(
          `[Server Error] Operation: ${operationName}, Status: ${error.statusCode}, Message: ${error.message}`
        ),
        SeverityLevel.Error
      );
      return;
    }

    // Handle JSON parse errors
    if (ServerParseError.is(error)) {
      logger.trackException(
        new Error(
          `[Parse Error] Operation: ${operationName}, Status: ${error.statusCode}, Message: ${error.message}`
        ),
        SeverityLevel.Error
      );
      return;
    }

    // Handle any other network errors
    if (error) {
      logger.trackException(
        new Error(`[Network Error] Operation: ${operationName}, Message: ${error.message}`),
        SeverityLevel.Error
      );
    }
  });

export const parseGraphQLErrorResponse = (errorResponse: readonly GraphQLFormattedError[]) => {
  return errorResponse.map((x) => x.message).join(' ');
};
