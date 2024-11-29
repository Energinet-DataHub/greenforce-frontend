import { ApolloError, ApolloQueryResult, OperationVariables } from '@apollo/client/core';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { QueryOptions, QueryResult, query } from './query';

// Lazy queries cannot be skipped as they are triggered imperatively
export interface LazyQueryOptions<TResult, TVariables extends OperationVariables>
  extends Omit<QueryOptions<TVariables>, 'skip'> {
  onCompleted?: (data: TResult) => void;
  onError?: (error: ApolloError) => void;
}

export interface LazyQueryResult<TResult, TVariables extends OperationVariables>
  extends QueryResult<TResult, TVariables> {
  query: (
    options?: Partial<LazyQueryOptions<TResult, TVariables>>
  ) => Promise<ApolloQueryResult<TResult>>;
}

/** Signal-based wrapper around Apollo's `query` function, made to align with `useLazyQuery`. */
export function lazyQuery<TResult, TVariables extends OperationVariables>(
  // Limited to TypedDocumentNode to ensure the query is statically typed
  document: TypedDocumentNode<TResult, TVariables>,
  options?: LazyQueryOptions<TResult, TVariables>
): LazyQueryResult<TResult, TVariables> {
  // Rename the options to avoid shadowing
  const parentOptions = options;
  const queryResult = query(document, { ...options, skip: true });
  return {
    ...queryResult,
    query: async (options?: Partial<LazyQueryOptions<TResult, TVariables>>) => {
      const { onError, onCompleted, ...queryOptions } = { ...parentOptions, ...options };
      const result = await queryResult.setOptions(queryOptions);
      if (result.error) {
        onError?.(result.error);
      } else if (result.data) {
        onCompleted?.(result.data);
      }

      return result;
    },
  };
}
