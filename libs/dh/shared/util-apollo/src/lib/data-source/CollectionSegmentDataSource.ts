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
import { QueryOptions } from '../query';
import { ApolloDataSource } from './ApolloDataSource';

type PagingVariables = {
  skip?: number | null;
  take?: number | null;
};

type CollectionSegment<T> = {
  pageInfo: unknown;
  totalCount: number;
  items?: T[] | null;
};

export class CollectionSegmentDataSource<
  TResult,
  TVariables extends PagingVariables,
  TNode,
> extends ApolloDataSource<TResult, TVariables, TNode, unknown, PagingVariables> {
  constructor(
    document: TypedDocumentNode<TResult, TVariables>,
    private _selector: (data: TResult) => CollectionSegment<TNode> | null | undefined,
    options?: QueryOptions<TVariables>
  ) {
    super(document, options);
  }

  selector = (data: TResult) => {
    const collection = this._selector(data);
    if (!collection) return collection;
    return { ...collection, nodes: collection.items };
  };

  nextPage = (paginator: MatPaginator) => ({
    skip: paginator.pageIndex * paginator.pageSize,
    take: paginator.pageSize,
  });

  previousPage = (paginator: MatPaginator) => ({
    skip: paginator.pageIndex * paginator.pageSize,
    take: paginator.pageSize,
  });

  firstPage = (paginator: MatPaginator) => ({
    skip: 0,
    take: paginator.pageSize,
  });

  lastPage = (paginator: MatPaginator) => ({
    skip: Math.floor(paginator.length / paginator.pageSize) * paginator.pageSize,
    take: paginator.pageSize,
  });
}
