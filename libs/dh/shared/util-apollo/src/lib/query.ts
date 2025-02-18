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
import {
  DestroyRef,
  Signal,
  computed,
  inject,
  linkedSignal,
  signal,
  untracked,
} from '@angular/core';
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
  share,
  shareReplay,
  skipWhile,
  startWith,
  subscribeOn,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { fromApolloError, mapGraphQLErrorsToApolloError } from './util/error';

export enum QueryStatus {
  Idle,
  Error,
  Loading,
  Resolved,
}

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
  hasError: Signal<boolean>;
  loading: Signal<boolean>;
  networkStatus: Signal<NetworkStatus>;
  status: Signal<QueryStatus>;
  called: Signal<boolean>;
  result: () => Promise<ApolloQueryResult<TResult>>;
  reset: () => void;
  getDocument: () => TypedDocumentNode<TResult, TVariables>;
  getOptions: () => QueryOptions<TVariables>;
  setOptions: (options: Partial<QueryOptions<TVariables>>) => Promise<ApolloQueryResult<TResult>>;
  refetch: (variables?: Partial<TVariables>) => Promise<ApolloQueryResult<TResult>>;
  subscribeToMore: <TSubscriptionData, TSubscriptionVariables>(
    options: SubscribeToMoreOptions<TResult, TSubscriptionData, TSubscriptionVariables>
  ) => () => void;
};

/** Create an initial ApolloQueryResult object. */
function makeInitialResult<T>(skip?: boolean): ApolloQueryResult<T> {
  return {
    data: undefined as T,
    error: undefined,
    loading: !skip,
    networkStatus: skip ? NetworkStatus.ready : NetworkStatus.loading,
  };
}

function makeReactive<R>(valueOrFunction: R | (() => R)) {
  return valueOrFunction instanceof Function
    ? linkedSignal(valueOrFunction)
    : signal(valueOrFunction);
}

/** Signal-based wrapper around Apollo's `watchQuery` function, made to align with `useQuery`. */
export function query<TResult, TVariables extends OperationVariables>(
  // Limited to TypedDocumentNode to ensure the query is statically typed
  document: TypedDocumentNode<TResult, TVariables>,
  options?: QueryOptions<TVariables> | (() => QueryOptions<TVariables>)
): QueryResult<TResult, TVariables> {
  // Inject dependencies
  const client = inject(Apollo);
  const destroyRef = inject(DestroyRef);

  // Make it possible to reset query and subscriptions to a pending state
  const reset$ = new Subject<void>();

  // Allow for the options object to be reactive (similar to `request` in Angular's `resource`)
  const optionsSignal = makeReactive(options);
  const options$ = toObservable(optionsSignal);

  // The `refetch` function on Apollo's `QueryRef` does not properly handle backpressure by
  // cancelling the previous request. As a workaround, the `valueChanges` is unsubscribed to and
  // a new `watchQuery` (with optionally new variables) is executed each time `refetch` is called.
  const ref$ = options$.pipe(
    filter((opts) => !opts?.skip),
    map((opts) =>
      client.watchQuery({
        errorPolicy: 'all',
        notifyOnNetworkStatusChange: true,
        ...opts,
        query: document,
        useInitialLoading: true,
      })
    )
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
    shareReplay(1), // Make sure the ref is available to late subscribers (in `subscribeToMore`)
    exists(), // Only emit the replayed ref if it is not null
    takeUntilDestroyed(destroyRef) // Shared observables need to be completed manually
  );

  const result$ = ref$.pipe(
    // The inner observable will be recreated each time the `options$` emits
    switchMap((ref) =>
      ref.valueChanges.pipe(
        takeUntil(reset$),
        map(({ errors, error, ...result }) => ({
          ...result,
          error: error ?? mapGraphQLErrorsToApolloError(errors),
        })),
        catchError((error: ApolloError) => fromApolloError<TResult>(error))
      )
    ),
    share()
  );

  const initial = makeInitialResult<TResult>(true);

  // Signals holding the result values
  const data = signal<TResult | undefined>(initial.data);
  const error = signal<ApolloError | undefined>(initial.error);
  const loading = signal(initial.loading);
  const networkStatus = signal(initial.networkStatus);
  const status = signal(QueryStatus.Idle);

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
    if (result.loading) status.set(QueryStatus.Loading);
    else if (result.error) status.set(QueryStatus.Error);
    else status.set(QueryStatus.Resolved);
  });

  // Clean up when the component is destroyed
  destroyRef.onDestroy(() => subscription.unsubscribe());

  return {
    // Upcast to prevent writing to signals
    data: data as Signal<TResult | undefined>,
    error: error as Signal<ApolloError | undefined>,
    hasError: computed(() => error() !== undefined),
    loading: loading as Signal<boolean>,
    networkStatus: networkStatus as Signal<NetworkStatus>,
    status: status as Signal<QueryStatus>,
    called: called as Signal<boolean>,
    result,
    reset: () => {
      reset$.next();
      optionsSignal.set({ ...options, skip: true });
      const initial = makeInitialResult<TResult>(true);
      data.set(initial.data);
      error.set(initial.error);
      loading.set(initial.loading);
      networkStatus.set(initial.networkStatus);
      status.set(QueryStatus.Idle);
      called.set(false);
    },
    getDocument: () => document,
    getOptions: () => optionsSignal() ?? {},
    setOptions: (newOptions: Partial<QueryOptions<TVariables>>) => {
      optionsSignal.update((prevOptions) => ({
        ...prevOptions,
        skip: false,
        ...newOptions,
        variables: { ...prevOptions?.variables, ...newOptions.variables } as TVariables,
      }));
      return result();
    },
    refetch: (newVariables?: Partial<TVariables>) => {
      optionsSignal.update((prevOptions) => ({
        ...prevOptions,
        skip: false,
        fetchPolicy: prevOptions?.nextFetchPolicy ?? 'network-only',
        variables: { ...prevOptions?.variables, ...newVariables } as TVariables,
      }));
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
