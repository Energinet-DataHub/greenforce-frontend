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
import { dayjs } from '@energinet-datahub/watt/utils/date';

import { MeteringGridImbalanceValuesToInclude } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhMeteringGridAreaImbalanceFilters } from './dh-metering-gridarea-imbalance-filters';
import { dhMGASortMetadataMapper } from './util/dh-sort-metadata-mapper.operator';

interface DhMeteringGridAreaImbalanceState {
  documentId: string;
  sortMetaData: Sort;
  pageMetaData: Pick<PageEvent, 'pageIndex' | 'pageSize'>;
  filters: DhMeteringGridAreaImbalanceFilters;
}

const initialState: DhMeteringGridAreaImbalanceState = {
  documentId: '',
  sortMetaData: {
    active: 'receivedDateTime',
    direction: 'desc',
  },
  pageMetaData: {
    pageIndex: 0,
    pageSize: 100,
  },
  filters: {
    created: {
      start: dayjs(new Date()).startOf('day').subtract(2, 'days').toDate(),
      end: dayjs(new Date()).endOf('day').toDate(),
    },
    valuesToInclude: MeteringGridImbalanceValuesToInclude.Imbalances,
  },
};

@Injectable()
export class DhMeteringGridAreaImbalanceStore extends ComponentStore<DhMeteringGridAreaImbalanceState> {
  private documentId$ = this.select(({ documentId }) => documentId);
  private sortMetaDataMapped$ = this.select(({ sortMetaData }) => sortMetaData).pipe(
    dhMGASortMetadataMapper
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
      filters: documentId
        ? { valuesToInclude: MeteringGridImbalanceValuesToInclude.Imbalances }
        : filters,
      pageMetaData,
      documentId,
      sortMetaData,
    }),
    { debounce: true }
  );

  readonly documentIdUpdate = this.updater<string>(
    (state, documentId): DhMeteringGridAreaImbalanceState => ({
      ...state,
      documentId,
      pageMetaData: { ...state.pageMetaData, pageIndex: 0 },
    })
  );

  constructor() {
    super(initialState);
  }
}
