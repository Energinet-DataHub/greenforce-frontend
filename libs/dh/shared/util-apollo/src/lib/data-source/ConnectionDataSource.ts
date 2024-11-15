import { TypedDocumentNode } from 'apollo-angular';
import { MatPaginator } from '@angular/material/paginator';
import { QueryOptions } from '../query';
import { ApolloDataSource } from './ApolloDataSource';

type PageInfo = {
  startCursor?: string | null;
  endCursor?: string | null;
};

type PagingVariables = {
  after?: string | null;
  before?: string | null;
  first?: number | null;
  last?: number | null;
};

type Connection<T> = {
  pageInfo: PageInfo;
  totalCount: number;
  nodes?: T[] | null;
};

export class ConnectionDataSource<
  TResult,
  TVariables extends PagingVariables,
  TNode,
> extends ApolloDataSource<TResult, TVariables, TNode, PageInfo, PagingVariables> {
  constructor(
    document: TypedDocumentNode<TResult, TVariables>,
    private _selector: (data: TResult) => Connection<TNode> | null | undefined,
    options?: QueryOptions<TVariables>
  ) {
    super(document, options);
  }

  selector = (data: TResult) => {
    const collection = this._selector(data);
    if (!collection) return collection;
    return { ...collection, nodes: collection.nodes };
  };

  nextPage = (paginator: MatPaginator, pageInfo: PageInfo) => ({
    after: pageInfo.endCursor,
    before: null,
    first: paginator.pageSize,
    last: null,
  });

  previousPage = (paginator: MatPaginator, pageInfo: PageInfo) => ({
    after: null,
    before: pageInfo.startCursor,
    first: null,
    last: paginator.pageSize,
  });

  firstPage = (paginator: MatPaginator) => ({
    after: null,
    before: null,
    first: paginator.pageSize,
    last: null,
  });

  lastPage = (paginator: MatPaginator) => ({
    after: null,
    before: null,
    first: null,
    last: paginator.length % paginator.pageSize,
  });
}
