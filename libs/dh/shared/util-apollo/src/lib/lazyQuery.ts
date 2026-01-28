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
import { OperationVariables, ErrorLike } from '@apollo/client';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { Apollo } from 'apollo-angular';
import { QueryOptions, QueryResult, SimpleQueryResult, query } from './query';

// Lazy queries cannot be skipped as they are triggered imperatively
// Use a simplified type that includes all the options we need
// Omit variables from the base type to make them optional
export type LazyQueryOptions<TResult, TVariables extends OperationVariables> = Omit<
  Apollo.WatchQueryOptions<TResult, TVariables>,
  'query' | 'useInitialLoading' | 'variables'
> & {
  variables?: TVariables;
  nextFetchPolicy?: Apollo.WatchQueryOptions<TResult, TVariables>['fetchPolicy'];
  onCompleted?: (data: TResult) => void;
  onError?: (error: ErrorLike) => void;
};

/** Simplified type for passing only variables to a lazy query */
export type LazyQueryVariables<TVariables extends OperationVariables> = {
  variables: TVariables;
};

export interface LazyQueryResult<TResult, TVariables extends OperationVariables>
  extends QueryResult<TResult, TVariables> {
  query: (
    options?: Partial<LazyQueryOptions<TResult, TVariables>> | LazyQueryVariables<TVariables>
  ) => Promise<SimpleQueryResult<TResult>>;
}

/** Signal-based wrapper around Apollo's `query` function, made to align with `useLazyQuery`. */
export function lazyQuery<TResult, TVariables extends OperationVariables>(
  // Limited to TypedDocumentNode to ensure the query is statically typed
  document: TypedDocumentNode<TResult, TVariables>,
  options?: LazyQueryOptions<TResult, TVariables> | (() => LazyQueryOptions<TResult, TVariables>)
): LazyQueryResult<TResult, TVariables> {
  // Rename the options to avoid shadowing
  const parentOptions = options;
  const queryResult = query(document, { ...options, skip: true } as QueryOptions<
    TResult,
    TVariables
  >);
  return {
    ...queryResult,
    query: async (
      options?: Partial<LazyQueryOptions<TResult, TVariables>> | LazyQueryVariables<TVariables>
    ) => {
      const { onError, onCompleted, ...queryOptions } = { ...parentOptions, ...options };
      const result = await queryResult.setOptions(
        queryOptions as Partial<QueryOptions<TResult, TVariables>>
      );
      if (result.error) {
        onError?.(result.error);
      } else if (result.data) {
        onCompleted?.(result.data);
      }

      return result;
    },
  };
}
