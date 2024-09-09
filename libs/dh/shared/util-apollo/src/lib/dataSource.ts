import { TypedDocumentNode } from 'apollo-angular';
import { DataSource } from '@angular/cdk/collections';
import { OperationVariables } from '@apollo/client/core';
import { map, take } from 'rxjs';
import { QueryOptions } from './query';
import { lazyQuery, LazyQueryOptions, LazyQueryResult } from './lazyQuery';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatSort } from '@angular/material/sort';
import { IWattTableDataSource } from '@energinet-datahub/watt/table';
import { MatPaginator } from '@angular/material/paginator';

interface ConnectionVariables extends OperationVariables {
  after?: string | null;
  before?: string | null;
  first?: number | null;
  last?: number | null;
}

type Connection<T> = {
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string | null;
    endCursor?: string | null;
  };
  // edges?: Maybe<Array<ArchivedMessagesEdge>>;
  totalCount: number;
  nodes?: T[] | null;
};

export class ApolloDataSource<TResult, TVariables extends ConnectionVariables, TNode>
  extends DataSource<TNode>
  implements IWattTableDataSource<TNode>
{
  private _tableQuery: LazyQueryResult<TResult, TVariables>;
  private _selector: (data: TResult) => Connection<TNode> | null | undefined;

  paginator!: MatPaginator;

  // eslint-disable-next-line sonarjs/cognitive-complexity
  constructor(
    document: TypedDocumentNode<TResult, TVariables>,
    selector: (data: TResult) => Connection<TNode> | null | undefined,
    options?: QueryOptions<TVariables>
  ) {
    super();

    this._selector = selector;

    this._tableQuery = lazyQuery(document, {
      ...options,
      onCompleted(data) {
        console.log('COMPLETED', data);
      },
    });

    toObservable(this._tableQuery.data).subscribe((data) => {
      if (!data) return;
      const conn = this._selector(data);
      if (!conn) return;
      this.paginator.length = conn.totalCount;
      this.data = new Array(conn.totalCount);
      this.filteredData = new Array(conn.totalCount);
      this.paginator.pageSize = 50; // Get from query variable?
      const endCursor = conn.pageInfo.endCursor;
      const startCursor = conn.pageInfo.startCursor;
      this.paginator.page.pipe(take(1)).subscribe((event) => {
        const previousPageIndex = event?.previousPageIndex ?? 0;
        const currentPageIndex = event.pageIndex;
        // This first so first page is never less than 50 (if total > 50 that is)
        if (!this.paginator.hasPreviousPage()) {
          this._tableQuery.refetch({
            after: null,
            before: null,
            first: 50,
            last: null,
          } as TVariables);
        } else if (currentPageIndex - previousPageIndex === 1) {
          this._tableQuery.refetch({
            after: endCursor,
            before: null,
            first: 50,
            last: null,
          } as TVariables);
        } else if (currentPageIndex - previousPageIndex === -1) {
          this._tableQuery.refetch({
            after: null,
            before: startCursor,
            first: null,
            last: 50,
          } as TVariables);
        } else if (!this.paginator.hasNextPage()) {
          this._tableQuery.refetch({
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

  sort: MatSort | null = null;

  filterPredicate = (data: TNode, filter: string) => true;

  sortData = (data: TNode[], sort: MatSort) => [] as TNode[];

  sortingDataAccessor = (data: TNode, sortHeaderId: string): string | number => '';

  query = (options?: LazyQueryOptions<TResult, TVariables>) => {
    this._tableQuery.query(options);
  };

  connect() {
    return this._tableQuery.valueChanges.pipe(
      map((result) => this._selector(result.data)),
      map((connection) => connection?.nodes ?? [])
    );
  }

  disconnect() {
    // empty
  }
}
