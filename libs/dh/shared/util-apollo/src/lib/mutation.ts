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
import { Signal, computed, inject, signal } from '@angular/core';
import { OperationVariables, ErrorLike } from '@apollo/client';
import { Apollo } from 'apollo-angular';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { firstValueFrom, map, catchError, of } from 'rxjs';

export enum MutationStatus {
  Idle,
  Error,
  Loading,
  Resolved,
}

// Add the `onCompleted` and `onError` callbacks to align with `useMutation`
// Note: We use a type alias and intersection instead of extending Omit to work around TS2312
// Make variables optional since they can be passed at mutation call time
export type MutationOptions<TResult, TVariables extends OperationVariables> = Omit<
  Apollo.MutateOptions<TResult, TVariables>,
  'mutation' | 'variables'
> & {
  variables?: TVariables;
  onCompleted?: (data: TResult, clientOptions?: MutationOptions<TResult, TVariables>) => void;
  onError?: (error: ErrorLike, clientOptions?: MutationOptions<TResult, TVariables>) => void;
};

/** Signal-based wrapper around Apollo's `mutate` function, made to align with `useMutation`. */
export function mutation<TResult, TVariables extends OperationVariables>(
  // Limited to TypedDocumentNode to ensure the query is statically typed
  document: TypedDocumentNode<TResult, TVariables>,
  options?: MutationOptions<TResult, TVariables>
) {
  // Rename the options to avoid shadowing
  const parentOptions = options;

  // Inject dependencies
  const client = inject(Apollo);

  // Signals holding the result values
  const data = signal<TResult | undefined>(undefined);
  const error = signal<ErrorLike | undefined>(undefined);
  const loading = signal(false);
  const called = signal(false);
  const status = signal(MutationStatus.Idle);

  return {
    // Upcast to prevent writing to signals
    data: data as Signal<TResult | undefined>,
    error: error as Signal<ErrorLike | undefined>,
    loading: loading as Signal<boolean>,
    hasError: computed(() => error() !== undefined),
    status: status as Signal<MutationStatus>,
    called: called as Signal<boolean>,
    reset: () => {
      data.set(undefined);
      error.set(undefined);
      loading.set(false);
      called.set(false);
      status.set(MutationStatus.Idle);
    },
    async mutate(options?: Partial<MutationOptions<TResult, TVariables>>) {
      const mergedOptions = { ...parentOptions, ...options };
      const { onCompleted, onError, ...mutationOptions } = mergedOptions;
      status.set(MutationStatus.Loading);
      loading.set(true);

      const result = await firstValueFrom(
        client
          .mutate<TResult, TVariables>({
            ...mutationOptions,
            mutation: document,
            // Use 'all' error policy to receive errors in the result instead of throwing
            errorPolicy: mutationOptions.errorPolicy ?? 'all',
          } as Apollo.MutateOptions<TResult, TVariables>)
          .pipe(
            map((result) => ({
              data: result.data,
              error: result.error,
            })),
            // Handle CombinedGraphQLErrors (thrown by Apollo Client 4.x for GraphQL errors)
            catchError((err: ErrorLike) => of({ data: undefined, error: err }))
          )
      );

      data.set(result.data ?? undefined);
      error.set(result.error);
      loading.set(false);
      called.set(true);

      if (result.error) {
        status.set(MutationStatus.Error);
        onError?.(result.error, mergedOptions as MutationOptions<TResult, TVariables>);
      } else if (result.data) {
        status.set(MutationStatus.Resolved);
        onCompleted?.(result.data, mergedOptions as MutationOptions<TResult, TVariables>);
      }

      return { data: result.data, error: result.error, loading: false };
    },
  };
}
