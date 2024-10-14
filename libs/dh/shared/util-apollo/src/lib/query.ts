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
import { DestroyRef, Signal, inject, signal, untracked } from '@angular/core';
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
  asyncScheduler,
  catchError,
  combineLatestWith,
  defer,
  delayWhen,
  distinctUntilChanged,
  filter,
  firstValueFrom,
  map,
  mergeWith,
  of,
  shareReplay,
  skipWhile,
  startWith,
  subscribeOn,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Since the `query` function is a wrapper around Apollo's `watchQuery`, the options API is almost
// exactly the same. This just makes some changes to better align with the `useQuery` hook.
export interface QueryOptions<TVariables extends OperationVariables>
  extends Omit<WatchQueryOptions<TVariables>, 'query' | 'useInitialLoading'> {
  // The `nextFetchPolicy` typically also accepts a function. Omitted for simplicity.
  nextFetchPolicy?: WatchQueryOptions<TVariables>['fetchPolicy'];
  skip?: boolean;
}

// The `subscribeToMore` function in Apollo's API is badly typed. This attempts to fix that.
export interface SubscribeToMoreOptions<TData, TSubscriptionData, TSubscriptionVariables>
  extends ApolloSubscribeToMoreOptions<TData, TSubscriptionVariables, TSubscriptionData> {
  document: TypedDocumentNode<TSubscriptionData, TSubscriptionVariables>;
}

export type QueryResult<TResult, TVariables extends OperationVariables> = {
  data: Signal<TResult | undefined>;
  error: Signal<ApolloError | undefined>;
  loading: Signal<boolean>;
  networkStatus: Signal<NetworkStatus>;
  called: Signal<boolean>;
  result: () => Promise<ApolloQueryResult<TResult>>;
  reset: () => void;
  getOptions: () => QueryOptions<TVariables>;
  setOptions: (options: Partial<QueryOptions<TVariables>>) => Promise<ApolloQueryResult<TResult>>;
  refetch: (variables?: Partial<TVariables>) => Promise<ApolloQueryResult<TResult>>;
  subscribeToMore: <TSubscriptionData, TSubscriptionVariables>(
    options: SubscribeToMoreOptions<TResult, TSubscriptionData, TSubscriptionVariables>
  ) => () => void;
};

/** Create an observable of ApolloQueryResult from an ApolloError. */
function fromApolloError<T>(error: ApolloError): Observable<ApolloQueryResult<T>> {
  return of({ error, data: undefined as T, loading: false, networkStatus: NetworkStatus.error });
}

/** Create an initial ApolloQueryResult object. */
function makeInitialResult<T>(skip?: boolean): ApolloQueryResult<T> {
  return {
    data: undefined as T,
    error: undefined,
    loading: !skip,
    networkStatus: skip ? NetworkStatus.ready : NetworkStatus.loading,
  };
}

/** Signal-based wrapper around Apollo's `watchQuery` function, made to align with `useQuery`. */
export function query<TResult, TVariables extends OperationVariables>(
  // Limited to TypedDocumentNode to ensure the query is statically typed
  document: TypedDocumentNode<TResult, TVariables>,
  options?: QueryOptions<TVariables>
): QueryResult<TResult, TVariables> {
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
    filter((opts) => !opts?.skip),
    map((opts) =>
      client.watchQuery({
        notifyOnNetworkStatusChange: true,
        ...opts,
        query: document,
        useInitialLoading: true,
      })
    ),
    // Make sure the ref is available to late subscribers (in `subscribeToMore`)
    shareReplay(1)
  );

  // It is possible for subscriptions to return before the initial query has completed, resulting
  // in a runtime error for the `updateQuery` method in `subscribeToMore`. To prevent this, the
  // `refReplay$` observable is created to ensure the cache has data before attempting to merge.
  const refWhenData$ = ref$.pipe(
    switchMap((ref) =>
      ref.valueChanges.pipe(
        skipWhile(({ data }) => !data), // Wait until data is available
        map(() => ref), // Then emit the ref
        take(1), // And complete the observable
        startWith(null), // Clear the ref immediately in case of refetch (to prevent stale ref)
        takeUntil(reset$) // Stop subscription if the query is reset
      )
    ),
    exists(), // Only emit the replayed ref if it is not null
    takeUntilDestroyed(destroyRef) // Shared observables need to be completed manually
  );

  const result$ = ref$.pipe(
    // The inner observable will be recreated each time the `options$` emits
    switchMap((ref) =>
      ref.valueChanges.pipe(
        takeUntil(reset$),
        catchError((error: ApolloError) => fromApolloError<TResult>(error))
      )
    )
  );

  const initial = makeInitialResult<TResult>(options?.skip);

  // Signals holding the result values
  const data = signal<TResult | undefined>(initial.data);
  const error = signal<ApolloError | undefined>(initial.error);
  const loading = signal(initial.loading);
  const networkStatus = signal(initial.networkStatus);

  // Extra signal to track if the query has been called
  const called = signal(false);

  // Gets the current ApolloQueryResult from signal values
  const toApolloQueryResult = () => ({
    data: data() as TResult, // Satisfy ApolloQueryResult type, but technically incorrect
    error: error(),
    loading: loading(),
    networkStatus: networkStatus(),
  });

  // Get the current result, or the incoming result if query is loading
  const result = () =>
    untracked(() =>
      firstValueFrom(
        // Wait for the current event loop to finish before attempting to
        // read the current result. This is to allow the query to enter a
        // loading state if result() is called immediately after querying.
        defer(() => [toApolloQueryResult()]).pipe(
          subscribeOn(asyncScheduler),
          mergeWith(result$),
          filter((result) => !result.loading),
          takeUntilDestroyed(destroyRef)
        ),
        // Prevent EmptyError if the parent component is destroyed before the first value is
        // emitted. This default value should be ignored, since the component is destroyed.
        // It is only to prevent (harmless) uncaught exceptions in the log.
        { defaultValue: makeInitialResult<TResult>(false) }
      )
    );

  // Update the signal values based on the result of the query
  const subscription = result$.subscribe((result) => {
    // The `data` field is wrongly typed and can actually be empty
    data.set(result.data ?? undefined);
    error.set(result.error);
    loading.set(result.loading);
    networkStatus.set(result.networkStatus);
    called.set(true);
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
    called: called as Signal<boolean>,
    result,
    reset: () => {
      reset$.next();
      options$.next({ ...options, skip: true });
      const initial = makeInitialResult<TResult>(true);
      data.set(initial.data);
      error.set(initial.error);
      loading.set(initial.loading);
      networkStatus.set(initial.networkStatus);
      called.set(false);
    },
    getOptions: () => options$.value ?? {},
    setOptions: (newOptions: Partial<QueryOptions<TVariables>>) => {
      const variables = { ...options$.value?.variables, ...newOptions.variables } as TVariables;
      options$.next({ ...options$.value, skip: false, ...newOptions, variables });
      return result();
    },
    refetch: (newVariables?: Partial<TVariables>) => {
      const variables = { ...options$.value?.variables, ...newVariables } as TVariables;
      const fetchPolicy = options$.value?.nextFetchPolicy ?? 'network-only';
      options$.next({ ...options$.value, skip: false, fetchPolicy, variables });
      return result();
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
          combineLatestWith(refWhenData$), // Ensure the ref (and cache) is ready
          distinctUntilChanged(([prev], [next]) => prev === next), // Only emit when data changes
          delayWhen(() => result()), // Do not attempt to merge when result is loading
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
