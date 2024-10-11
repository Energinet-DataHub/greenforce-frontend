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
import { ApolloError, ApolloQueryResult, NetworkStatus } from '@apollo/client/core';
import { GraphQLErrors } from '@apollo/client/errors';
import { Observable, of } from 'rxjs';

/** Create an observable of ApolloQueryResult from an ApolloError. */
export function fromApolloError<T>(error: ApolloError): Observable<ApolloQueryResult<T>> {
  return of({ error, data: undefined as T, loading: false, networkStatus: NetworkStatus.error });
}

/** Map an optional array of GraphQL errors to an ApolloError, or undefined if no errors */
export function mapGraphQLErrorsToApolloError(errors?: GraphQLErrors) {
  return errors?.length ? new ApolloError({ graphQLErrors: errors }) : undefined;
}
