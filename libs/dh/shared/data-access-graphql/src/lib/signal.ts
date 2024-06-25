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
import {
  ApolloError,
  OperationVariables,
  SubscribeToMoreOptions as ApolloSubscribeToMoreOptions,
  NetworkStatus,
} from '@apollo/client/core';
import { Apollo, WatchQueryOptions } from 'apollo-angular';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import {
  BehaviorSubject,
  map,
  shareReplay,
  startWith,
  switchMap,
  takeWhile,
  withLatestFrom,
} from 'rxjs';
import { exists } from '@energinet-datahub/dh/shared/util-operators';

// Since the `query` function is a wrapper around Apollo's `watchQuery`, the API is almost
// exactly the same, with the exception the query field, which is now a separate argument.
export type QueryOptions<TVariables extends OperationVariables> = Omit<
  WatchQueryOptions<TVariables>,
  'query'
>;

// The `subscribeToMore` function in Apollo's API is badly typed. This attempts to fix that.
export interface SubscribeToMoreOptions<TData, TSubscriptionData, TSubscriptionVariables>
  extends ApolloSubscribeToMoreOptions<TData, TSubscriptionVariables, TSubscriptionData> {
  document: TypedDocumentNode<TSubscriptionData, TSubscriptionVariables>;
}

/** Signal-based wrapper around Apollo's `watchQuery` function, made to align with `useQuery`. */
export function query<TResult, TVariables extends OperationVariables>(
  // Limited to TypedDocumentNode to ensure the query is statically typed
  query: TypedDocumentNode<TResult, TVariables>,
  options: QueryOptions<TVariables>
) {
  // Inject dependencies
  const client = inject(Apollo);
  const destroyRef = inject(DestroyRef);

  // The `refetch` function on Apollo's `QueryRef` does not properly handle backpressure by
  // cancelling the previous request. As a workaround, the `valueChanges` is unsubscribed to and
  // a new `watchQuery` (with optionally new variables) is executed each time `refetch` is called.
  const variables$ = new BehaviorSubject(options.variables);
  const ref$ = variables$.pipe(map((v) => client.watchQuery({ ...options, query, variables: v })));

  // The inner observable will be recreated each time the `variables$` emits
  const result$ = ref$.pipe(switchMap((ref) => ref.valueChanges));

  // It is possible for subscriptions to return before the initial query has completed, resulting
  // in a runtime error for the `updateQuery` method in `subscribeToMore`. To prevent this, the
  // `refReplay$` observable is created to ensure the cache has data before attempting to merge.
  const refReplay$ = ref$.pipe(
    switchMap((ref) =>
      ref.valueChanges.pipe(
        map(({ data }) => (data ? ref : null)),
        takeWhile((ref) => !ref, true), // Once data is available, emit the ref and complete
        startWith(null) // Clear the ref immediately in case of refetch (to prevent stale ref)
      )
    ),
    shareReplay(1), // Make sure the ref is available to late subscribers (in `subscribeToMore`)
    exists() // Only emit the replayed ref if it is not null
  );

  const data = signal<TResult | undefined>(undefined);
  const error = signal<ApolloError | undefined>(undefined);
  const loading = signal(true);
  const networkStatus = signal<NetworkStatus>(NetworkStatus.loading);

  // Update the signal values based on the result of the query
  const subscription = result$.subscribe({
    next(result) {
      data.set(result.data);
      error.set(result.error);
      loading.set(result.loading);
      networkStatus.set(result.networkStatus);
    },
    error(err: ApolloError) {
      error.set(err);
      loading.set(false);
      networkStatus.set(NetworkStatus.error);
    },
  });

  // Clean up when the component is destroyed
  destroyRef.onDestroy(() => {
    variables$.complete();
    subscription.unsubscribe();
  });

  return {
    // Upcast to prevent writing to signals
    data: data as Signal<TResult | undefined>,
    error: error as Signal<ApolloError | undefined>,
    loading: loading as Signal<boolean>,
    networkStatus: networkStatus as Signal<NetworkStatus>,
    refetch: (variables?: Partial<TVariables>) =>
      variables$.next({ ...variables$.value, ...variables } as TVariables),
    subscribeToMore<TSubscriptionData, TSubscriptionVariables>({
      document: query,
      context,
      updateQuery,
      variables,
      onError,
    }: SubscribeToMoreOptions<TResult, TSubscriptionData, TSubscriptionVariables>) {
      // Create an observable that immediately makes a GraphQL subscription, but then
      // waits for the ref to be ready before attempting to merge the data into the cache.
      const subscription = client
        .subscribe({ query, variables, context })
        .pipe(
          map(({ data }) => data),
          exists(), // The data should generally be available, but type system says otherwise
          withLatestFrom(refReplay$) // Ensure the ref (and cache) is ready
        )
        .subscribe({
          next([data, ref]) {
            if (!updateQuery) return;
            // The update query callback has a second argument named `variables` which contains the
            // variables used by the original query. But the types for `updateQuery` seem to expect
            // subscription variables, which is why that argument is unused. Might be incorrect.
            ref.updateQuery((prev) => updateQuery(prev, { subscriptionData: { data }, variables }));
          },
          error(err: Error) {
            if (!onError) return;
            onError(err);
          },
        });

      // Stop the subscription when the component is destroyed
      destroyRef.onDestroy(() => subscription.unsubscribe());

      // Allow the caller to terminate the subscription manually
      return () => subscription.unsubscribe();
    },
  };
}
