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
import { DestroyRef, Signal, inject, signal } from '@angular/core';
import { ApolloError } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { catchError, filter, firstValueFrom, map, of, take, tap } from 'rxjs';
import { MutationOptions as ApolloMutationOptions } from 'apollo-angular/types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Add the `onCompleted` and `onError` callbacks to align with `useMutation`
export interface MutationOptions<TResult, TVariables>
  extends Omit<ApolloMutationOptions<TResult, TVariables>, 'mutation'> {
  onCompleted?: (data: TResult, clientOptions?: MutationOptions<TResult, TVariables>) => void;
  onError?: (error: ApolloError, clientOptions?: MutationOptions<TResult, TVariables>) => void;
}

/** Signal-based wrapper around Apollo's `mutate` function, made to align with `useMutation`. */
export function mutation<TResult, TVariables>(
  // Limited to TypedDocumentNode to ensure the query is statically typed
  document: TypedDocumentNode<TResult, TVariables>,
  options?: MutationOptions<TResult, TVariables>
) {
  // Rename the options to avoid shadowing
  const parentOptions = options;

  // Inject dependencies
  const client = inject(Apollo);
  const destroyRef = inject(DestroyRef);

  // Signals holding the result values
  const data = signal<TResult | undefined>(undefined);
  const error = signal<ApolloError | undefined>(undefined);
  const loading = signal(true);

  return {
    // Upcast to prevent writing to signals
    data: data as Signal<TResult | undefined>,
    error: error as Signal<ApolloError | undefined>,
    loading: loading as Signal<boolean>,
    mutate(options: MutationOptions<TResult, TVariables>) {
      const mergedOptions = { ...parentOptions, ...options };
      const { onCompleted, onError, ...mutationOptions } = mergedOptions;
      return firstValueFrom(
        client.mutate({ ...mutationOptions, mutation: document }).pipe(
          // The MutationResult type is different from QueryResult in several ways
          map(({ errors, ...result }) => ({
            ...result,
            error: errors?.length ? new ApolloError({ graphQLErrors: errors }) : undefined,
          })),
          catchError((error: ApolloError) => of({ error, data: undefined, loading: false })),
          tap((result) => {
            data.set(result.data ?? undefined);
            error.set(result.error);
            loading.set(result.loading);
          }),
          // Since this observable returns a promise, it should only emit the final result
          filter((result) => !result.loading),
          tap((result) => {
            if (result.error) {
              onError?.(result.error, mergedOptions);
            } else if (result.data) {
              onCompleted?.(result.data, mergedOptions);
            }
          }),
          take(1), // Complete the observable when result is available
          takeUntilDestroyed(destroyRef) // Or when the component is destroyed
        )
      );
    },
  };
}
