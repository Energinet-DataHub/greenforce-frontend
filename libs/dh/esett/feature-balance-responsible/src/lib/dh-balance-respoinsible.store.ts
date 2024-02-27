import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ComponentStore } from '@ngrx/component-store';

import { dhSortMetadataMapper } from './util/dh-sort-metadata-mapper.operator';

interface DhBalanceResponsibleState {
  sortMetaData: Sort;
  pageMetaData: Pick<PageEvent, 'pageIndex' | 'pageSize'>;
}

const initialState: DhBalanceResponsibleState = {
  sortMetaData: {
    active: 'received',
    direction: 'desc',
  },
  pageMetaData: {
    pageIndex: 0,
    pageSize: 1,
  },
};

@Injectable()
export class DhBalanceResponsibleStore extends ComponentStore<DhBalanceResponsibleState> {
  private sortMetaDataMapped$ = this.select(({ sortMetaData }) => sortMetaData).pipe(
    dhSortMetadataMapper
  );

  readonly pageMetaData$ = this.select(({ pageMetaData }) => pageMetaData);
  readonly sortMetaData$ = this.select(({ sortMetaData }) => sortMetaData);

  readonly queryVariables$ = this.select(
    this.sortMetaDataMapped$,
    this.pageMetaData$,
    (sortMetaData, pageMetaData) => ({
      pageMetaData,
      sortMetaData,
    }),
    { debounce: true }
  );

  constructor() {
    super(initialState);
  }
}
