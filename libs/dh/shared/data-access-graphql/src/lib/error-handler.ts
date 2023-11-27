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
import { onError } from '@apollo/client/link/error';

import { DhApplicationInsights } from '@energinet-datahub/dh/shared/util-application-insights';
import { translate } from '@ngneat/transloco';
import { GraphQLError } from 'graphql';

export const errorHandler = (logger: DhApplicationInsights) =>
  onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, extensions }) => {
        logger.trackException(new Error((extensions['details'] as string) || message), 3);
      });
    }
  });

export const parseGraphQLErrorResponse = (errorResponse: readonly GraphQLError[]) => {
  return errorResponse
    .map((x) => {
      const translationKey = `graphQLErrors.${x.name.toLowerCase()}`;
      const translation = translate(translationKey);
      return translation === translationKey ? x.message : translation;
    })
    .join(' ');
};
