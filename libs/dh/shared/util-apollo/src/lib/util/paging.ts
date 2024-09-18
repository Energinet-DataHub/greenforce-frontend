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
