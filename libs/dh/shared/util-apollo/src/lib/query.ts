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
  WritableSignal,
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
import { Apollo, QueryRef, WatchQueryOptions } from 'apollo-angular';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import {
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
  share,
  shareReplay,
  skipWhile,
  startWith,
  subscribeOn,
  switchMap,
  take,
  takeUntil,
  tap,
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
export interface QueryOptions<TResult, TVariables extends OperationVariables, TData>
  extends Omit<WatchQueryOptions<TVariables>, 'query' | 'useInitialLoading'> {
  // The `nextFetchPolicy` typically also accepts a function. Omitted for simplicity.
  nextFetchPolicy?: WatchQueryOptions<TVariables>['fetchPolicy'];
  skip?: boolean;
  map?: (result: TResult) => TData;
}

// The `subscribeToMore` function in Apollo's API is badly typed. This attempts to fix that.
export interface SubscribeToMoreOptions<TData, TSubscriptionData, TSubscriptionVariables>
  extends ApolloSubscribeToMoreOptions<TData, TSubscriptionVariables, TSubscriptionData> {
  document: TypedDocumentNode<TSubscriptionData, TSubscriptionVariables>;
}

export type QueryResult<TResult, TVariables extends OperationVariables, TData = TResult> = {
  result: Signal<ApolloQueryResult<TResult | undefined>>;
  data: Signal<TData | undefined>;
  hasError: Signal<boolean>;
  error: Signal<ApolloError | undefined>;
  loading: Signal<boolean>;
  networkStatus: Signal<NetworkStatus>;
  status: Signal<QueryStatus>;
  called: Signal<boolean>;
  succeeded: () => this is SucceededQueryResult<TResult, TVariables, TData>;
  failed: () => this is FailedQueryResult<TResult, TVariables, TData>;
  toPromise: () => Promise<ApolloQueryResult<TResult | undefined>>;
  reset: () => void;
  getDocument: () => TypedDocumentNode<TResult, TVariables>;
  getOptions: () => QueryOptions<TResult, TVariables, TData>;
  setOptions: (
    options: Partial<QueryOptions<TResult, TVariables, TData>>
  ) => Promise<ApolloQueryResult<TResult | undefined>>;
  refetch: (variables?: Partial<TVariables>) => Promise<ApolloQueryResult<TResult | undefined>>;
  subscribeToMore: <TSubscriptionData, TSubscriptionVariables>(
    options: SubscribeToMoreOptions<TResult, TSubscriptionData, TSubscriptionVariables>
  ) => () => void;
};

export type SucceededQueryResult<TResult, TVariables extends OperationVariables, TData> = Omit<
  QueryResult<TResult, TVariables, TData>,
  'data'
> & {
  data: Signal<TData>;
};

export type FailedQueryResult<TResult, TVariables extends OperationVariables, TData> = Omit<
  QueryResult<TResult, TVariables, TData>,
  'error'
> & {
  error: Signal<ApolloError>;
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

function normalizeQueryResult<T>(result: ApolloQueryResult<T>): ApolloQueryResult<T | undefined> {
  return {
    ...result,
    error: result.error ?? mapGraphQLErrorsToApolloError(result.errors),
  };
}

export class QueryImpl<TResult extends TData, TVariables extends OperationVariables, TData>
  implements QueryResult<TResult, TVariables, TData>
{
  // Inject dependencies
  private client = inject(Apollo);
  private destroyRef = inject(DestroyRef);

  private initialResult = makeInitialResult<TResult>(true);
  private options: WritableSignal<QueryOptions<TResult, TVariables, TData> | undefined>;
  private initialOptions = computed(() => untracked(this.options)); // hmmm
  private result$: Observable<ApolloQueryResult<TResult | undefined>>;
  private refWhenData$: Observable<QueryRef<TResult, TVariables>>;

  // Make it possible to reset query and subscriptions to a pending state
  private reset$ = new Subject<void>();

  called = signal(false);
  result = signal<ApolloQueryResult<TResult | undefined>>(this.initialResult);
  data = computed(() => this.computeData());
  error = computed(() => this.result().error);
  hasError = computed(() => !!this.error()); // TODO: Remove this in favor of failed()
  loading = computed(() => this.result().loading);
  networkStatus = computed(() => this.result().networkStatus);
  status = computed(() => this.computeStatus());

  constructor(
    private document: TypedDocumentNode<TResult, TVariables>,
    options?:
      | QueryOptions<TResult, TVariables, TData>
      | (() => QueryOptions<TResult, TVariables, TData>)
  ) {
    // Allow for the options object to be reactive (similar to `request` in Angular's `resource`)
    this.options = makeReactive(options);
    const options$ = toObservable(this.options);

    // The `refetch` function on Apollo's `QueryRef` does not properly handle backpressure by
    // cancelling the previous request. As a workaround, the `valueChanges` is unsubscribed to and
    // a new `watchQuery` (with optionally new variables) is executed each time `refetch` is called.
    const ref$ = options$.pipe(
      filter((opts) => !opts?.skip),
      map((opts) =>
        this.client.watchQuery({
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
    this.refWhenData$ = ref$.pipe(
      switchMap((ref) =>
        ref.valueChanges.pipe(
          skipWhile(({ data }) => !data), // Wait until data is available
          map(() => ref), // Then emit the ref
          take(1), // And complete the observable
          startWith(null), // Clear the ref immediately in case of refetch (to prevent stale ref)
          takeUntil(this.reset$) // Stop subscription if the query is reset
        )
      ),
      shareReplay(1), // Make sure the ref is available to late subscribers (in `subscribeToMore`)
      exists(), // Only emit the replayed ref if it is not null
      takeUntilDestroyed(this.destroyRef) // Shared observables need to be completed manually
    );

    this.result$ = ref$.pipe(
      // The inner observable will be recreated each time the `options$` emits
      switchMap((ref) =>
        ref.valueChanges.pipe(
          takeUntil(this.reset$),
          map(normalizeQueryResult),
          catchError((error: ApolloError) => fromApolloError<TResult | undefined>(error))
        )
      ),
      share()
    );

    // Update the signal values based on the result of the query
    const subscription = this.result$
      .pipe(tap(() => this.called.set(true)))
      .subscribe((result) => this.result.set(result));

    // Clean up when the component is destroyed
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  /** reactive. could it be computed?  */
  failed(
    this: QueryResult<TResult, TVariables, TData>
  ): this is FailedQueryResult<TResult, TVariables, TData> {
    return this.status() === QueryStatus.Error && this.error() !== undefined;
  }

  /** reactive. could it be computed? */
  succeeded(
    this: QueryResult<TResult, TVariables, TData>
  ): this is SucceededQueryResult<TResult, TVariables, TData> {
    return this.status() === QueryStatus.Resolved && this.data() !== undefined;
  }

  reset() {
    this.reset$.next();
    // reading initialOptions could in theory fail here if reset is called right after creation
    this.options.set({ ...this.initialOptions, skip: true });
    this.called.set(false);
    this.result.set(this.initialResult);
  }

  getDocument = () => this.document;

  getOptions = () => this.options() ?? {};

  setOptions(options: Partial<QueryOptions<TResult, TVariables, TData>>) {
    this.options.update((prevOptions) => ({
      ...prevOptions,
      skip: false,
      ...options,
      variables: { ...prevOptions?.variables, ...options.variables } as TVariables,
    }));

    return this.toPromise();
  }

  refetch(variables?: Partial<TVariables>) {
    this.options.update((prevOptions) => ({
      ...prevOptions,
      skip: false,
      fetchPolicy: prevOptions?.nextFetchPolicy ?? 'network-only',
      variables: { ...prevOptions?.variables, ...variables } as TVariables,
    }));

    return this.toPromise();
  }

  /** Gets the current result, or the incoming result if query is loading. */
  toPromise() {
    return untracked(() =>
      firstValueFrom(
        // Wait for the current event loop to finish before attempting to
        // read the current result. This is to allow the query to enter a
        // loading state if result() is called immediately after querying.
        defer(() => [this.result()]).pipe(
          subscribeOn(asyncScheduler),
          mergeWith(this.result$),
          filter((result) => !result.loading),
          takeUntilDestroyed(this.destroyRef)
        ),
        // Prevent EmptyError if the parent component is destroyed before the first value is
        // emitted. This default value should be ignored, since the component is destroyed.
        // It is only to prevent (harmless) uncaught exceptions in the log.
        { defaultValue: makeInitialResult<TResult>(false) }
      )
    );
  }

  subscribeToMore<TSubscriptionData, TSubscriptionVariables>({
    document: query,
    context,
    updateQuery,
    variables,
    onError,
  }: SubscribeToMoreOptions<TResult, TSubscriptionData, TSubscriptionVariables>) {
    // Create an observable that immediately makes a GraphQL subscription, but then
    // waits for the ref to be ready before attempting to merge the data into the cache.
    const subscription = this.client
      .subscribe({ query, variables, context })
      .pipe(
        map(({ data }) => data),
        exists(), // The data should generally be available, but types says otherwise
        combineLatestWith(this.refWhenData$), // Ensure the ref (and cache) is ready
        distinctUntilChanged(([prev], [next]) => prev === next), // Only emit when data changes
        delayWhen(() => this.toPromise()), // Do not attempt to merge when result is loading
        takeUntilDestroyed(this.destroyRef), // Stop the subscription when the component is destroyed
        takeUntil(this.reset$) // Or when resetting the query
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
  }

  private computeData() {
    const data = this.result().data;
    const options = this.options();
    return options?.map && data ? options.map(data) : data;
  }

  private computeStatus() {
    const loading = this.loading();
    const error = this.error();
    if (loading) return QueryStatus.Loading;
    else if (error) return QueryStatus.Error;
    else return QueryStatus.Resolved;
  }
}

/** Signal-based wrapper around Apollo's `watchQuery` function, made to align with `useQuery`. */
export function query<
  TResult extends TData,
  TVariables extends OperationVariables,
  TData = TResult,
>(
  // Limited to TypedDocumentNode to ensure the query is statically typed
  document: TypedDocumentNode<TResult, TVariables>,
  options?:
    | QueryOptions<TResult, TVariables, TData>
    | (() => QueryOptions<TResult, TVariables, TData>)
): QueryResult<TResult, TVariables, TData> {
  return new QueryImpl(document, options);
  // query.init();
  // return query;
}
