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
import { ApolloError, ApolloQueryResult, OperationVariables } from '@apollo/client/core';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { QueryImpl, QueryOptions, QueryResult } from './query';

// Lazy queries cannot be skipped as they are triggered imperatively
export interface LazyQueryOptions<TResult, TVariables extends OperationVariables, TData>
  extends Omit<QueryOptions<TResult, TVariables, TData>, 'skip'> {
  onCompleted?: (data: TResult) => void;
  onError?: (error: ApolloError) => void;
}

export interface LazyQueryResult<TResult, TVariables extends OperationVariables, TData>
  extends QueryResult<TResult, TVariables, TData> {
  query: (
    options?: Partial<LazyQueryOptions<TResult, TVariables, TData>>
  ) => Promise<ApolloQueryResult<TResult | undefined>>;
}

class LazyQueryImpl<TResult extends TData, TVariables extends OperationVariables, TData>
  extends QueryImpl<TResult, TVariables, TData>
  implements LazyQueryResult<TResult, TVariables, TData>
{
  async query(options?: Partial<LazyQueryOptions<TResult, TVariables, TData>>) {
    const { onError, onCompleted, ...queryOptions } = { ...this.getOptions(), ...options };
    const result = await this.setOptions(queryOptions);
    if (result.error) {
      onError?.(result.error);
    } else if (result.data) {
      onCompleted?.(result.data);
    }

    return result;
  }
}

/** Signal-based wrapper around Apollo's `query` function, made to align with `useLazyQuery`. */
export function lazyQuery<
  TResult extends TData,
  TVariables extends OperationVariables,
  TData = TResult,
>(
  // Limited to TypedDocumentNode to ensure the query is statically typed
  document: TypedDocumentNode<TResult, TVariables>,
  options?:
    | LazyQueryOptions<TResult, TVariables, TData>
    | (() => LazyQueryOptions<TResult, TVariables, TData>)
): LazyQueryResult<TResult, TVariables, TData> {
  return new LazyQueryImpl(document, { ...options, skip: true });
}
