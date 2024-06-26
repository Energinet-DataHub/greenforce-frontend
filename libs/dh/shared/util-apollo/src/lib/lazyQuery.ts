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
import { ApolloError, OperationVariables } from '@apollo/client/core';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { QueryOptions, query } from './query';

// Lazy queries cannot be skipped as they are triggered imperatively
export interface LazyQueryOptions<TResult, TVariables extends OperationVariables>
  extends Omit<QueryOptions<TVariables>, 'skip'> {
  onCompleted?: (data: TResult) => void;
  onError?: (error: ApolloError) => void;
}

/** Signal-based wrapper around Apollo's `query` function, made to align with `useLazyQuery`. */
export function lazyQuery<TResult, TVariables extends OperationVariables>(
  // Limited to TypedDocumentNode to ensure the query is statically typed
  document: TypedDocumentNode<TResult, TVariables>,
  options?: LazyQueryOptions<TResult, TVariables>
) {
  const result = query(document, { ...options, skip: true });
  return {
    ...result,
    query: (options: Partial<LazyQueryOptions<TResult, TVariables>>) =>
      result.setOptions(options).then((result) => {
        if (result.error) {
          options?.onError?.(result.error);
        } else if (result.data) {
          options?.onCompleted?.(result.data);
        }

        // Only tap into the chain for side-effects
        return result;
      }),
  };
}
