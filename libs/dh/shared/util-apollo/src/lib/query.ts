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
  ApolloQueryResult,
} from '@apollo/client/core';
import { Apollo, WatchQueryOptions } from 'apollo-angular';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  filter,
  firstValueFrom,
  map,
  of,
  shareReplay,
  skipWhile,
  startWith,
  switchMap,
  take,
  takeUntil,
  withLatestFrom,
} from 'rxjs';
import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/** Create an observable of ApolloQueryResult from an ApolloError. */
function fromApolloError<T>(error: ApolloError): Observable<ApolloQueryResult<T>> {
  return of({ error, data: undefined as T, loading: false, networkStatus: NetworkStatus.error });
}

// Since the `query` function is a wrapper around Apollo's `watchQuery`, the options API is almost
// exactly the same. This just makes some changes to better align with the `useQuery` hook.
export interface QueryOptions<TVariables extends OperationVariables>
  extends Omit<WatchQueryOptions<TVariables>, 'query' | 'useInitialLoading'> {
  skip?: boolean;
}

// The `subscribeToMore` function in Apollo's API is badly typed. This attempts to fix that.
export interface SubscribeToMoreOptions<TData, TSubscriptionData, TSubscriptionVariables>
  extends ApolloSubscribeToMoreOptions<TData, TSubscriptionVariables, TSubscriptionData> {
  document: TypedDocumentNode<TSubscriptionData, TSubscriptionVariables>;
}

/** Signal-based wrapper around Apollo's `watchQuery` function, made to align with `useQuery`. */
export function query<TResult, TVariables extends OperationVariables>(
  // Limited to TypedDocumentNode to ensure the query is statically typed
  document: TypedDocumentNode<TResult, TVariables>,
  options?: QueryOptions<TVariables>
) {
  // Inject dependencies
  const client = inject(Apollo);
  const destroyRef = inject(DestroyRef);

  // Make it possible to reset query and subscriptions to a pending state
  const reset$ = new Subject<void>();

  // The `refetch` function on Apollo's `QueryRef` does not properly handle backpressure by
  // cancelling the previous request. As a workaround, the `valueChanges` is unsubscribed to and
  // a new `watchQuery` (with optionally new variables) is executed each time `refetch` is called.
  const options$ = new BehaviorSubject(options);
  const ref$ = options$.pipe(
    skipWhile((opts) => opts?.skip ?? false),
    map((opts) => client.watchQuery({ ...opts, query: document }))
  );

  // It is possible for subscriptions to return before the initial query has completed, resulting
  // in a runtime error for the `updateQuery` method in `subscribeToMore`. To prevent this, the
  // `refReplay$` observable is created to ensure the cache has data before attempting to merge.
  const refReplay$ = ref$.pipe(
    switchMap((ref) =>
      ref.valueChanges.pipe(
        skipWhile((data) => !data), // Wait until data is available
        map(() => ref), // Then emit the ref
        take(1), // And complete the observable
        startWith(null), // Clear the ref immediately in case of refetch (to prevent stale ref)
        takeUntil(reset$) // Stop subscription if the query is reset
      )
    ),
    shareReplay(1), // Make sure the ref is available to late subscribers (in `subscribeToMore`)
    exists(), // Only emit the replayed ref if it is not null
    takeUntilDestroyed(destroyRef) // Shared observables need to be completed manually
  );

  const result$ = ref$.pipe(
    // The inner observable will be recreated each time the `options$` emits
    switchMap((ref) => ref.valueChanges.pipe(takeUntil(reset$))),
    catchError((error: ApolloError) => fromApolloError<TResult>(error))
  );

  // Signals holding the result values
  const data = signal<TResult | undefined>(undefined);
  const error = signal<ApolloError | undefined>(undefined);
  const loading = signal(!options?.skip);
  const networkStatus = signal(options?.skip ? NetworkStatus.ready : NetworkStatus.loading);

  // Update the signal values based on the result of the query
  const subscription = result$.subscribe((result) => {
    // The `data` field is wrongly typed and can actually be empty
    data.set(result.data ?? undefined);
    error.set(result.error);
    loading.set(result.loading);
    networkStatus.set(result.networkStatus);
  });

  // Clean up when the component is destroyed
  destroyRef.onDestroy(() => {
    options$.complete();
    subscription.unsubscribe();
  });

  return {
    // Upcast to prevent writing to signals
    data: data as Signal<TResult | undefined>,
    error: error as Signal<ApolloError | undefined>,
    loading: loading as Signal<boolean>,
    networkStatus: networkStatus as Signal<NetworkStatus>,
    reset: () => {
      reset$.next();
      data.set(undefined);
      error.set(undefined);
      loading.set(false);
      networkStatus.set(NetworkStatus.ready);
    },
    setOptions: (options: Partial<QueryOptions<TVariables>>) => {
      const result = firstValueFrom(result$.pipe(filter((result) => !result.loading)));
      options$.next({ ...options$.value, skip: false, ...options });
      return result;
    },
    refetch: (variables?: Partial<TVariables>) => {
      const result = firstValueFrom(result$.pipe(filter((result) => !result.loading)));
      const mergedVariables = { ...options$.value?.variables, ...variables } as TVariables;
      options$.next({
        ...options$.value,
        skip: false,
        variables: mergedVariables,
        fetchPolicy: 'network-only',
      });
      return result;
    },
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
          exists(), // The data should generally be available, but types says otherwise
          withLatestFrom(refReplay$), // Ensure the ref (and cache) is ready,
          takeUntilDestroyed(destroyRef), // Stop the subscription when the component is destroyed
          takeUntil(reset$) // Or when resetting the query
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

      // Allow the caller to terminate the subscription manually
      return () => subscription.unsubscribe();
    },
  };
}
