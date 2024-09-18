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
import { OperationVariables } from '@apollo/client/core';
import {
  BehaviorSubject,
  debounceTime,
  EMPTY,
  filter,
  map,
  merge,
  Observable,
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
import { query, QueryOptions, QueryResult } from './query';
import { signal } from '@angular/core';
import { exists } from '@energinet-datahub/dh/shared/util-operators';

type SortInput = Record<string, 'ASC' | 'DESC' | null | undefined>;
type SelectorFn<TResult, TNode> = (data: TResult) => Connection<TNode> | null | undefined;
type Connection<T> = {
  pageInfo: {
    // hasNextPage: boolean;
    // hasPreviousPage: boolean;
    startCursor?: string | null;
    endCursor?: string | null;
  };
  // edges?: Maybe<Array<ArchivedMessagesEdge>>;
  totalCount: number;
  nodes?: T[] | null;
};

interface ConnectionVariables extends OperationVariables {
  after?: string | null;
  before?: string | null;
  first?: number | null;
  last?: number | null;
  order?: SortInput | SortInput[] | null;
  filter?: string | null;
}

export class ApolloDataSource<TResult, TVariables extends ConnectionVariables, TNode>
  extends DataSource<TNode>
  implements IWattTableDataSource<TNode>
{
  private _query: QueryResult<TResult, TVariables>;
  private _connection: Observable<Connection<TNode>>;
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
    options?: QueryOptions<TVariables>
  ) {
    super();

    this._query = query(document, options);
    this._connection = toObservable(this._query.data).pipe(
      exists(),
      map((data) => selector(data)),
      exists()
    );

    this._updateChangeSubscription();

    // toObservable(this._query.data).subscribe((data) => {
    //   // if (!data) return;
    //   // const conn = this._selector(data);
    //   // if (!conn) return;
    //   // const paginator = this.paginator;
    //   // if (!paginator) return;
    //   // paginator.disabled = false;
    //   const endCursor = conn.pageInfo.endCursor;
    //   const startCursor = conn.pageInfo.startCursor;
    //   paginator.page.pipe(take(1)).subscribe((event) => {
    //     const previousPageIndex = event?.previousPageIndex ?? 0;
    //     const currentPageIndex = event.pageIndex;
    //     paginator.disabled = true; // Looks bad, but cursor based doesnt support click spamming
    //     // This first so first page is never less than 50 (if total > 50 that is)
    //     if (!paginator.hasPreviousPage()) {
    //       this._query.refetch({
    //         after: null,
    //         before: null,
    //         first: 50,
    //         last: null,
    //       } as TVariables);
    //     } else if (currentPageIndex - previousPageIndex === 1) {
    //       this._query.refetch({
    //         after: endCursor,
    //         before: null,
    //         first: 50,
    //         last: null,
    //       } as TVariables);
    //     } else if (currentPageIndex - previousPageIndex === -1) {
    //       this._query.refetch({
    //         after: null,
    //         before: startCursor,
    //         first: null,
    //         last: 50,
    //       } as TVariables);
    //     } else if (!paginator.hasNextPage()) {
    //       this._query.refetch({
    //         after: null,
    //         before: null,
    //         first: null,
    //         last: conn.totalCount % 50, // Get from query variable?
    //       } as TVariables);
    //     }
    //   });
    // });
  }

  sortData = (data: TNode[], sort: MatSort) => {
    return [] as TNode[];
  };

  sortingDataAccessor = (data: TNode, sortHeaderId: string): string | number => '';

  // TODO: should we reset sorting/pagination when refetching?
  refetch = (variables?: TVariables) => {
    this._query.refetch(variables);
  };

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

    const filterChange = this._filter.pipe(
      debounceTime(100),
      map((filter) => ({ filter }))
    );

    // TODO: Go to first page on Paginator on sort change
    const sortChange = !sort
      ? EMPTY
      : sort.sortChange.pipe(
          filter((s) => Boolean(s.direction)),
          map((s) => ({ order: { [s.active]: s.direction.toUpperCase() } })),
          tap(() => paginator?.firstPage())
        );

    const pageChange = EMPTY; //!paginator
    // ? EMPTY
    // : this._connection.pipe(
    //     tap((connection) => (paginator.length = connection.totalCount)),
    //     tap(() => (paginator.disabled = false)),
    //     switchMap((connection) =>
    //       paginator.page.pipe(
    //         take(1),
    //         takeUntil(sortChange), // TODO: Test this
    //         tap(() => (paginator.disabled = true)),
    //         map((event) => Paging.make(event.pageSize, connection)),
    //         tap((paging) => {
    //           switch (Paging.getIntent(paging)) {
    //             case Paging.Intent.FIRST:
    //               return Paging.firstPage(paging);
    //             case Paging.Intent.NEXT:
    //               return Paging.nextPage(paging);
    //             case Paging.Intent.PREVIOUS:
    //               return Paging.previousPage(paging);
    //             case Paging.Intent.LAST:
    //               return Paging.lastPage(paging);
    //           }
    //         })
    //       )
    //     )
    //   );

    const variablesChange = merge(filterChange, sortChange, pageChange) as Observable<TVariables>;
    this._subscription?.unsubscribe();
    this._subscription = variablesChange.subscribe((variables) => this.refetch(variables));
  }
}
