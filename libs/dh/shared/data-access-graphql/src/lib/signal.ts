import { DestroyRef, Signal, inject, signal } from '@angular/core';
import {
  ApolloError,
  OperationVariables,
  SubscribeToMoreOptions as ApolloSubscribeToMoreOptions,
} from '@apollo/client/core';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { Apollo, WatchQueryOptions } from 'apollo-angular';
import { BehaviorSubject, map, switchMap } from 'rxjs';

export interface QueryOptions<TVariables extends OperationVariables>
  extends Omit<WatchQueryOptions<TVariables>, 'query'> {
  variables?: TVariables;
}

export interface SubscribeToMoreOptions<TData, TSubscriptionData, TSubscriptionVariables>
  extends ApolloSubscribeToMoreOptions<TData, TSubscriptionVariables, TSubscriptionData> {
  document: TypedDocumentNode<TSubscriptionData, TSubscriptionVariables>;
}

export function query<TResult, TVariables extends OperationVariables>(
  query: TypedDocumentNode<TResult, TVariables>,
  { variables, ...options }: QueryOptions<TVariables>
) {
  const client = inject(Apollo);
  const destroyRef = inject(DestroyRef);

  const variables$ = new BehaviorSubject(variables);

  // or result$ of { data, error, loading, subscribeToMore etc... }
  const query$ = variables$.pipe(
    map((variables) => client.watchQuery({ query, variables, ...options })),
    switchMap((ref) => ref.valueChanges.pipe(map((result) => ({ result, ref }))))
  );

  const subscription = query$.subscribe({
    next({ result }) {
      loading.set(result.loading);
      if (result.data) data.set(result.data);
      if (result.error) error.set(result.error);
    },
    error(err: ApolloError) {
      loading.set(false);
      error.set(err);
    },
  });

  destroyRef.onDestroy(() => {
    variables$.complete();
    subscription.unsubscribe();
  });

  const data = signal<TResult | undefined>(undefined);
  const loading = signal(true);
  const error = signal<ApolloError | undefined>(undefined);

  return {
    // Upcast to prevent writing to signals
    data: data as Signal<TResult | undefined>,
    error: error as Signal<ApolloError | undefined>,
    loading: loading as Signal<boolean>,
    refetch: (variables: TVariables) => variables$.next(variables),
    subscribeToMore<TSubscriptionData, TSubscriptionVariables>(
      options: SubscribeToMoreOptions<TResult, TSubscriptionData, TSubscriptionVariables>
    ) {
      // remember to fix race condition when subscription returns faster than the query
    },
  };
}
