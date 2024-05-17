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
import { dayjs } from '@energinet-datahub/watt/utils/date';
import { ComponentStore } from '@ngrx/component-store';

import { dhExchangeSortMetadataMapper } from './dh-sort-metadata-mapper.operator';
import { DhOutgoingMessagesFilters } from './dh-outgoing-messages-filters';

interface DhOutgoingMessagesState {
  documentId: string;
  sortMetaData: Sort;
  pageMetaData: Pick<PageEvent, 'pageIndex' | 'pageSize'>;
  filters: DhOutgoingMessagesFilters;
}

const initialState: DhOutgoingMessagesState = {
  documentId: '',
  sortMetaData: {
    active: 'created',
    direction: 'desc',
  },
  pageMetaData: {
    pageIndex: 0,
    pageSize: 100,
  },
  filters: {
    created: {
      start: dayjs(new Date()).startOf('day').subtract(3, 'days').toDate(),
      end: dayjs(new Date()).endOf('day').toDate(),
    },
  },
};

@Injectable()
export class DhOutgoingMessagesStore extends ComponentStore<DhOutgoingMessagesState> {
  private documentId$ = this.select(({ documentId }) => documentId);
  private sortMetaDataMapped$ = this.select(({ sortMetaData }) => sortMetaData).pipe(
    dhExchangeSortMetadataMapper
  );

  readonly pageMetaData$ = this.select(({ pageMetaData }) => pageMetaData);
  readonly sortMetaData$ = this.select(({ sortMetaData }) => sortMetaData);
  readonly filters$ = this.select(({ filters }) => filters);

  readonly queryVariables$ = this.select(
    this.documentId$,
    this.sortMetaDataMapped$,
    this.pageMetaData$,
    this.filters$,
    (documentId, sortMetaData, pageMetaData, filters) => ({
      filters: documentId ? {} : filters,
      pageMetaData,
      documentId,
      sortMetaData,
    }),
    { debounce: true }
  );

  readonly documentIdUpdate = this.updater<string>(
    (state, documentId): DhOutgoingMessagesState => ({
      ...state,
      documentId,
      pageMetaData: { ...state.pageMetaData, pageIndex: 0 },
    })
  );

  constructor() {
    super(initialState);
  }
}
