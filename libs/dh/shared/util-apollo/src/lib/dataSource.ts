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
import { TypedDocumentNode } from 'apollo-angular';
import {
  BehaviorSubject,
  connectable,
  debounceTime,
  filter,
  map,
  merge,
  Observable,
  ReplaySubject,
  skip,
  startWith,
  Subscription,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { DataSource } from '@angular/cdk/collections';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { IWattTableDataSource } from '@energinet-datahub/watt/table';
import { lazyQuery, LazyQueryOptions, LazyQueryResult } from './lazyQuery';
import { signal } from '@angular/core';
import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { Connection, ConnectionVariables, SelectorFn } from './types';
import { navigate, firstPage } from './util/paging';

export class ApolloDataSource<TResult, TVariables extends ConnectionVariables, TNode>
  extends DataSource<TNode>
  implements IWattTableDataSource<TNode>
{
  private _query: LazyQueryResult<TResult, TVariables>;
  private _connection: Observable<Connection<TNode>>;
  private _inputChange: ReplaySubject<TVariables | undefined> = new ReplaySubject(1);
  private _subscription?: Subscription;

  private _totalCount = signal(0);
  private _data = signal<TNode[]>([]);
  private _sort: MatSort | null = null;
  private _filter = new BehaviorSubject('');
  private _paginator: MatPaginator | null = null;

  get totalCount() {
    return this._totalCount();
  }

  get data() {
    return this._data();
  }

  get loading() {
    return this._query.loading();
  }

  get error() {
    return this._query.error();
  }
  get filteredData() {
    return this.data;
  }

  get filter() {
    return this._filter.value;
  }
  set filter(filter) {
    this._filter.next(filter);
  }

  get sort() {
    return this._sort;
  }
  set sort(sort) {
    if (sort) this._configureSort(sort);
    this._sort = sort;
    this._updateChangeSubscription();
  }

  get paginator() {
    return this._paginator;
  }
  set paginator(paginator) {
    this._paginator = paginator;
    this._updateChangeSubscription();
  }

  constructor(
    document: TypedDocumentNode<TResult, TVariables>,
    selector: SelectorFn<TResult, TNode>,
    options?: LazyQueryOptions<TResult, TVariables>
  ) {
    super();

    this._query = lazyQuery(document, options);
    this._connection = toObservable(this._query.data).pipe(
      exists(),
      map((data) => selector(data)),
      exists()
    );
  }

  refetch = (variables?: TVariables) => this._inputChange.next(variables);

  connect() {
    return this._connection.pipe(
      tap((connection) => this._totalCount.set(connection.totalCount)),
      map((connection) => connection.nodes ?? []),
      tap((nodes) => this._data.set(nodes)),
      startWith([] as TNode[])
    );
  }

  disconnect() {
    this._subscription?.unsubscribe();
    this._subscription = undefined;
    this._inputChange.complete();
    this._filter.complete();
  }

  _configureSort(sort: MatSort) {
    // There is no concept of a "default" sort direction in GraphQL
    sort.disableClear = true;

    // Read the initial sort input from variables
    const variables = this._query.getOptions().variables;
    const order = variables?.order;
    const initialSort = Array.isArray(order) ? order[0] : order;
    if (!initialSort) return;

    // Update MatSort to reflect the initial sort
    const [id, direction] = Object.entries(initialSort)[0];
    sort.sort({
      id,
      start: (direction?.toLowerCase() ?? '') as SortDirection,
      disableClear: true,
    });
  }

  _updateChangeSubscription() {
    const { sort, paginator } = this;

    // Sorting and pagination are required for this data source
    if (!sort || !paginator) return;

    const filterChange = this._filter.pipe(
      skip(1),
      debounceTime(100),
      map((filter) => ({ filter }))
    );

    const sortChange = sort.sortChange.pipe(
      filter((s) => Boolean(s.direction)),
      map((s) => ({ ...firstPage(paginator), order: { [s.active]: s.direction.toUpperCase() } })),
      tap(() => paginator.firstPage())
    );

    // Create observables that emits just before the sort and input changes, in order
    // to prevent the paginator observable from running in response to `firstPage()`.
    const beforeSortChange = connectable(sort.sortChange);
    const beforeInputChange = connectable(this._inputChange);
    const pageChange = this._connection.pipe(
      tap((connection) => (paginator.length = connection.totalCount)),
      tap(() => (paginator.disabled = false)),
      switchMap((connection) =>
        paginator.page.pipe(
          take(1),
          takeUntil(beforeSortChange),
          takeUntil(beforeInputChange),
          tap(() => (paginator.disabled = true)),
          map((event) => navigate(paginator, event, connection.pageInfo))
        )
      )
    );

    const inputChange = this._inputChange.pipe(
      tap(() => paginator.firstPage()),
      map((variables) => ({
        ...firstPage(paginator),
        ...variables,
      }))
    );

    const variablesChange = merge(
      filterChange,
      sortChange,
      pageChange,
      inputChange
    ) as Observable<TVariables>;

    this._subscription?.unsubscribe();
    this._subscription = beforeSortChange.connect();
    this._subscription.add(beforeInputChange.connect());
    this._subscription.add(variablesChange.subscribe((v) => this._query.refetch(v)));
  }
}
