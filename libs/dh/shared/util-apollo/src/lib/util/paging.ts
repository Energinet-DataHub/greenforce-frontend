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
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PageInfo } from '../types';

export const nextPage = (paginator: MatPaginator, after: string) => ({
  after,
  before: null,
  first: paginator.pageSize,
  last: null,
});

export const previousPage = (paginator: MatPaginator, before: string) => ({
  after: null,
  before,
  first: null,
  last: paginator.pageSize,
});

export const firstPage = (paginator: MatPaginator) => ({
  after: null,
  before: null,
  first: paginator.pageSize,
  last: null,
});

export const lastPage = (paginator: MatPaginator) => ({
  after: null,
  before: null,
  first: null,
  last: paginator.length % paginator.pageSize,
});

export const navigate = (paginator: MatPaginator, event: PageEvent, pageInfo: PageInfo) => {
  const delta = paginator.pageIndex - (event?.previousPageIndex ?? 0);
  if (!paginator.hasPreviousPage()) return firstPage(paginator);
  if (!paginator.hasNextPage()) return lastPage(paginator);
  if (delta === 1 && pageInfo.endCursor) return nextPage(paginator, pageInfo.endCursor);
  if (delta === -1 && pageInfo.startCursor) return previousPage(paginator, pageInfo.startCursor);
  return firstPage(paginator);
};
