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
    pageSize: 100,
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
