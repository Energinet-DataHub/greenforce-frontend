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
