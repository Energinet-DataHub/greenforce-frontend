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
import { filter, map, Observable, startWith, take } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { DataSource } from '@angular/cdk/collections';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { IWattTableDataSource } from '@energinet-datahub/watt/table';
import { query, QueryOptions, QueryResult } from './query';

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
}

export class ApolloDataSource<TResult, TVariables extends ConnectionVariables, TNode>
  extends DataSource<TNode>
  implements IWattTableDataSource<TNode>
{
  private _query: QueryResult<TResult, TVariables>;
  private _selector: SelectorFn<TResult, TNode>;
  private _valueChanges: Observable<TResult>;
  private _paginator: MatPaginator | null = null;
  private _sort: MatSort | null = null;

  get sort() {
    return this._sort;
  }
  set sort(sort) {
    this._sort = sort;
    this._updateChangeSubscription();
  }

  get paginator() {
    return this._paginator;
  }
  set paginator(paginator) {
    this._paginator = paginator;
    // this._updateChangeSubscription();
  }

  _updateChangeSubscription() {
    const { sort, paginator } = this;
    if (!sort || !paginator) return;
    sort.disableClear = true;
    const variables = this._query.getOptions().variables;
    if (!variables?.order) return;
    const order = variables.order as SortInput | SortInput[] | null | undefined;
    const initialSort = Array.isArray(order) ? order[0] : order;
    if (!initialSort) return;
    Object.keys(initialSort).forEach((key) => {
      sort.sort({
        id: key,
        start: initialSort[key]?.toLowerCase() as SortDirection,
        disableClear: true,
      });
    });
    sort?.sortChange.subscribe((sort) => {
      paginator.firstPage(); // TODO: This emits a page event, which is not ideal
      if (!sort.direction) return;
      this._query.refetch({
        order: { [sort.active]: sort.direction.toUpperCase() },
      } as TVariables);
    });
  }

  constructor(
    document: TypedDocumentNode<TResult, TVariables>,
    selector: SelectorFn<TResult, TNode>,
    options?: QueryOptions<TVariables>
  ) {
    super();

    this._selector = selector;
    this._query = query(document, options);
    this._valueChanges = toObservable(this._query.data).pipe(filter(Boolean));

    this._updateChangeSubscription();

    toObservable(this._query.data).subscribe((data) => {
      if (!data) return;
      const conn = this._selector(data);
      if (!conn) return;
      const paginator = this.paginator;
      if (!paginator) return;
      paginator.disabled = false;
      paginator.length = conn.totalCount;
      this.data = new Array(conn.totalCount);
      this.filteredData = new Array(conn.totalCount);
      paginator.pageSize = 50; // Get from query variable?
      const endCursor = conn.pageInfo.endCursor;
      const startCursor = conn.pageInfo.startCursor;
      paginator.page.pipe(take(1)).subscribe((event) => {
        const previousPageIndex = event?.previousPageIndex ?? 0;
        const currentPageIndex = event.pageIndex;
        paginator.disabled = true; // Looks bad, but cursor based doesnt support click spamming
        // This first so first page is never less than 50 (if total > 50 that is)
        if (!paginator.hasPreviousPage()) {
          this._query.refetch({
            after: null,
            before: null,
            first: 50,
            last: null,
          } as TVariables);
        } else if (currentPageIndex - previousPageIndex === 1) {
          this._query.refetch({
            after: endCursor,
            before: null,
            first: 50,
            last: null,
          } as TVariables);
        } else if (currentPageIndex - previousPageIndex === -1) {
          this._query.refetch({
            after: null,
            before: startCursor,
            first: null,
            last: 50,
          } as TVariables);
        } else if (!paginator.hasNextPage()) {
          this._query.refetch({
            after: null,
            before: null,
            first: null,
            last: conn.totalCount % 50, // Get from query variable?
          } as TVariables);
        }
      });
    });
  }

  data: TNode[] = [];

  filter = '';

  filteredData: TNode[] = [];

  filterPredicate = (data: TNode, filter: string) => true;

  sortData = (data: TNode[], sort: MatSort) => {
    console.log(data, sort);
    return [] as TNode[];
  };

  sortingDataAccessor = (data: TNode, sortHeaderId: string): string | number => '';

  refetch = (variables?: TVariables) => {
    this._query.refetch(variables);
  };

  connect() {
    return this._valueChanges.pipe(
      map((data) => this._selector(data)),
      map((connection) => connection?.nodes ?? []),
      startWith([] as TNode[])
    );
  }

  disconnect() {
    // empty
  }
}
