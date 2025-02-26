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
import { TypedDocumentNode } from 'apollo-angular';
import { MatPaginator } from '@angular/material/paginator';
import { ApolloDataSource, ApolloDataSourceQueryOptions } from './ApolloDataSource';
import { ObjectType } from '../query';

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
  TResult extends ObjectType,
  TVariables extends PagingVariables,
  TNode,
> extends ApolloDataSource<TResult, TVariables, TNode, PageInfo, PagingVariables> {
  constructor(
    document: TypedDocumentNode<TResult, TVariables>,
    private _selector: (data: TResult) => Connection<TNode> | null | undefined,
    options?: ApolloDataSourceQueryOptions<TVariables>
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
