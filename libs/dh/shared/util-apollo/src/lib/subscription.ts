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
import { DestroyRef, inject, Signal, signal } from '@angular/core';
import { ApolloError } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { catchError, map, of, tap } from 'rxjs';
import { SubscriptionOptionsAlone as ApolloSubscriptionOptions } from 'apollo-angular/types';
import { mapGraphQLErrorsToApolloError } from './util/error';

// Add the `onCompleted` and `onError` callbacks to align with `useMutation`
export interface SubscriptionOptions<TResult, TVariables> extends ApolloSubscriptionOptions {
  variables?: TVariables;
  onData?: (data: TResult) => void;
  onError?: (error: ApolloError) => void;
  onCompleted?: () => void;
}

/**
 * Signal-based wrapper around Apollo's `subscribe` function, made to align with `useSubscripion`.
 */
export function subscription<TResult, TVariables>(
  // Limited to TypedDocumentNode to ensure the query is statically typed
  document: TypedDocumentNode<TResult, TVariables>,
  options?: SubscriptionOptions<TResult, TVariables>
) {
  // Inject dependencies
  const client = inject(Apollo);
  const destroyRef = inject(DestroyRef);

  // Signals holding the result values
  const data = signal<TResult | undefined>(undefined);
  const error = signal<ApolloError | undefined>(undefined);

  const subscription = client
    .subscribe({ query: document, ...options })
    .pipe(
      map(({ errors, data }) => ({ data, error: mapGraphQLErrorsToApolloError(errors) })),
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
