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
import { OperationVariables } from '@apollo/client/core';
import { TypedDocumentNode } from 'apollo-angular';
import {
  BehaviorSubject,
  connectable,
  debounceTime,
  filter,
  map,
  mergeWith,
  Observable,
  ReplaySubject,
  skip,
  Subscription,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { DataSource } from '@angular/cdk/collections';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { IWattTableDataSource } from '@energinet-datahub/watt/table';
import { query, QueryOptions, QueryResult } from '../query';
import { signal } from '@angular/core';
import { exists } from '@energinet-datahub/dh/shared/util-operators';

export type SortInput = Record<string, 'ASC' | 'DESC' | null | undefined>;
export interface CommonVariables extends OperationVariables {
  order?: SortInput | SortInput[] | null;
  filter?: string | null;
}

export type Pageable<TNode, TPageInfo> = {
  pageInfo: TPageInfo;
  totalCount: number;
  nodes: TNode[] | null | undefined;
};

export abstract class ApolloDataSource<
    TResult,
    TVariables extends TPagingVariables,
    TNode,
    TPageInfo,
    TPagingVariables extends CommonVariables,
  >
  extends DataSource<TNode>
  implements IWattTableDataSource<TNode>
{
  private _query: QueryResult<TResult, TVariables>;
  private _pageable: Observable<Pageable<TNode, TPageInfo>>;
  private _inputChange: ReplaySubject<Partial<TVariables> | undefined> = new ReplaySubject(1);
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

  get queryTime() {
    return this._query.queryTime;
  }

  get loading() {
    return this._query.loading();
  }

  get query() {
    return this._query;
  }

  get called() {
    return this._query.called();
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
    // Wait for the next tick to prevent NG0100 and to make sure MatSort is ready
    setTimeout(() => {
      if (sort) this._configureSort(sort);
      this._sort = sort;
      this._updateChangeSubscription();
    });
  }

  get paginator() {
    return this._paginator;
  }
  set paginator(paginator) {
    // Wait for the next tick to make sure MatPaginator is ready
    setTimeout(() => {
      this._paginator = paginator;
      this._updateChangeSubscription();
    });
  }

  constructor(
    document: TypedDocumentNode<TResult, TVariables>,
    options?: QueryOptions<TVariables>
  ) {
    super();

    this._query = query(document, { ...options, skip: true });
    this._pageable = toObservable(this._query.data).pipe(
      exists(),
      map((data) => this.selector(data)),
      exists()
    );

    if (!options?.skip) this._inputChange.next(options?.variables);
  }

  refetch = (variables?: Partial<TVariables>) => this._inputChange.next(variables);
  subscribeToMore: QueryResult<TResult, TVariables>['subscribeToMore'] = (options) =>
    this._query.subscribeToMore(options);

  reset() {
    // Reset subject so it does not have an initial value
    this._inputChange = new ReplaySubject(1);
    this._updateChangeSubscription();
    this._totalCount.set(0);
    this._data.set([]);
    this._query.reset();
    if (this.paginator) this.paginator.length = 0;
    if (this.sort) this._configureSort(this.sort);
  }

  connect() {
    return toObservable(this._data);
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
    const start = (direction?.toLowerCase() ?? '') as SortDirection;

    // Setting the sort to the same values will toggle direction
    if (sort.active === id && sort.direction === start) return;
    sort.sort({ id, start, disableClear: true });
  }

  _updateChangeSubscription() {
    const { sort, paginator } = this;

    // Sorting and pagination are required for this data source
    if (!sort || !paginator) return;

    const inputChange = this._filter.pipe(
      skip(1),
      debounceTime(100),
      map((filter) => ({ filter })),
      mergeWith(this._inputChange),
      map((variables) => ({ variables }))
    );

    const sortChange = sort.sortChange.pipe(
      filter((s) => Boolean(s.direction)),
      map((s) => ({ [s.active]: s.direction.toUpperCase() })),
      map((order) => ({ skip: this.totalCount <= 1, variables: { order } }))
    );

    // Create observables that emits just before the sort and input changes, in order
    // to prevent the paginator observable from running in response to `firstPage()`.
    const beforeInputChange = connectable(inputChange);
    const beforeSortChange = connectable(sort.sortChange);
    const pageChange = this._pageable.pipe(
      tap((pageable) => this._totalCount.set(pageable.totalCount)),
      tap((pageable) => (paginator.length = pageable.totalCount)),
      tap(() => (paginator.disabled = false)),
      switchMap((connection) =>
        paginator.page.pipe(
          take(1),
          takeUntil(beforeInputChange),
          takeUntil(beforeSortChange),
          tap(() => (paginator.disabled = true)),
          map((event) => this._navigate(paginator, event, connection.pageInfo)),
          map((variables) => ({ variables }))
        )
      )
    );

    const dataChange = this._pageable.pipe(map((pageable) => pageable.nodes ?? []));
    const optionsChange = inputChange.pipe(
      mergeWith(sortChange),
      tap(() => paginator.firstPage()),
      map((opts) => ({ ...opts, variables: { ...this.firstPage(paginator), ...opts.variables } })),
      mergeWith(pageChange),
      map((opts) => ({ ...opts, fetchPolicy: 'cache-and-network' })),
      map((opts) => opts as QueryOptions<TVariables>)
    );

    this._subscription?.unsubscribe();
    this._subscription = dataChange.subscribe((nodes) => this._data.set(nodes));
    this._subscription.add(beforeInputChange.connect());
    this._subscription.add(beforeSortChange.connect());
    this._subscription.add(optionsChange.subscribe((opts) => this._query.setOptions(opts)));
  }

  _navigate(paginator: MatPaginator, event: PageEvent, pageInfo: TPageInfo) {
    const delta = paginator.pageIndex - (event?.previousPageIndex ?? 0);
    if (!paginator.hasPreviousPage()) return this.firstPage(paginator);
    if (!paginator.hasNextPage()) return this.lastPage(paginator);
    if (delta === 1) return this.nextPage(paginator, pageInfo);
    if (delta === -1) return this.previousPage(paginator, pageInfo);
    return this.firstPage(paginator);
  }

  abstract selector(data: TResult): Pageable<TNode, TPageInfo> | null | undefined;
  abstract nextPage(paginator: MatPaginator, pageInfo: TPageInfo): TPagingVariables;
  abstract previousPage(paginator: MatPaginator, pageInfo: TPageInfo): TPagingVariables;
  abstract firstPage(paginator: MatPaginator): TPagingVariables;
  abstract lastPage(paginator: MatPaginator): TPagingVariables;
}
