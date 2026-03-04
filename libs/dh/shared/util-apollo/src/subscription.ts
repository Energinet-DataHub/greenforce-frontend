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
import { DestroyRef, inject, Signal, signal } from '@angular/core';
import {
  ApolloError,
  FetchResult,
  OperationVariables,
  SubscriptionOptions as ApolloSubscriptionOptions,
} from '@apollo/client/core';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { catchError, from, map, of, tap } from 'rxjs';
import { mapGraphQLErrorsToApolloError } from './util/error';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DhApollo } from '@energinet-datahub/dh/shared/data-access-graphql';
import { fixObservable } from './query';

// Add the `onCompleted` and `onError` callbacks to align with `useMutation`
export interface SubscriptionOptions<TResult, TVariables extends OperationVariables | undefined>
  extends Omit<ApolloSubscriptionOptions<TVariables>, 'query'> {
  onData?: (data: TResult) => void;
  onError?: (error: ApolloError) => void;
  onCompleted?: () => void;
}

export type SubscriptionResult<T> = FetchResult<T> & {
  error?: ApolloError;
};

/**
 * Signal-based wrapper around Apollo's `subscribe` function, made to align with `useSubscripion`.
 */
export function subscription<TResult, TVariables extends OperationVariables>(
  // Limited to TypedDocumentNode to ensure the query is statically typed
  document: TypedDocumentNode<TResult, TVariables>,
  options?: SubscriptionOptions<TResult, TVariables>
) {
  // Inject dependencies
  const apollo = inject(DhApollo);
  const destroyRef = inject(DestroyRef);

  // Signals holding the result values
  const data = signal<TResult | undefined>(undefined);
  const error = signal<ApolloError | undefined>(undefined);

  const subscription = from(fixObservable(apollo.client.subscribe({ query: document, ...options })))
    .pipe(
      map(
        ({ errors, data }) =>
          ({ data, error: mapGraphQLErrorsToApolloError(errors) }) as SubscriptionResult<TResult>
      ),
      catchError((error: ApolloError) => of({ error, data: undefined })),
      tap((result) => {
        data.set(result.data ?? undefined);
        error.set(result.error);
      })
    )
    .subscribe({
      next(result) {
        if (result.data) options?.onData?.(result.data);
        if (result.error) options?.onError?.(result.error);
      },
      complete() {
        options?.onCompleted?.();
      },
    });

  // Clean up when the component is destroyed
  destroyRef.onDestroy(() => {
    subscription.unsubscribe();
  });

  return {
    // Upcast to prevent writing to signals
    data: data as Signal<TResult | undefined>,
    error: error as Signal<ApolloError | undefined>,
    unsubscribe: () => subscription.unsubscribe(),
  };
}
