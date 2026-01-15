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
import { NetworkStatus, ErrorLike } from '@apollo/client';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { Observable, of } from 'rxjs';
import type { GraphQLFormattedError } from 'graphql';
import type { SimpleQueryResult } from '../query';

/** Create an observable of query result from an error. */
export function fromApolloError<T>(error: ErrorLike): Observable<SimpleQueryResult<T>> {
  return of({
    error,
    data: undefined,
    loading: false,
    networkStatus: NetworkStatus.error,
  });
}

/** Extract GraphQL errors from an ErrorLike object if it's a CombinedGraphQLErrors instance */
export function getGraphQLErrors(
  error: ErrorLike | undefined
): ReadonlyArray<GraphQLFormattedError> | undefined {
  if (!error) return undefined;
  return CombinedGraphQLErrors.is(error) ? error.errors : undefined;
}
