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
import { Sort } from '@angular/material/sort';
import { computed, effect } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { translate } from '@ngneat/transloco';

import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';

import {
  DownloadEsettExchangeEventsDocument,
  GetOutgoingMessagesDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { dayjs } from '@energinet-datahub/watt/date';

import {
  dhExchangeSortMetadataMapper,
  ExchangeEventSort,
} from './dh-sort-metadata-mapper.operator';

import { DhOutgoingMessagesFilters } from './dh-outgoing-messages-filters';

type DhOutgoingMessagesState = {
  documentId: string;
  sortMetaData: Sort;
  pageMetaData: Pick<PageEvent, 'pageIndex' | 'pageSize'>;
  filters: DhOutgoingMessagesFilters;
};

type QueryVariables = {
  filters: Partial<DhOutgoingMessagesFilters>;
  pageMetaData: Pick<PageEvent, 'pageIndex' | 'pageSize'>;
  documentId: string;
  sortMetaData: ExchangeEventSort;
};

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

export const DhOutgoingMessagesSignalStore = signalStore(
  withState(initialState),
  withComputed(({ sortMetaData, documentId, pageMetaData, filters }) => ({
    queryVariables: computed<QueryVariables>(() => ({
      filters: documentId() ? {} : filters(),
      pageMetaData: pageMetaData(),
      documentId: documentId(),
      sortMetaData: dhExchangeSortMetadataMapper(sortMetaData()),
    })),
    sort: sortMetaData,
    sortMetaData: computed(() => dhExchangeSortMetadataMapper(sortMetaData())),
  })),
  withComputed(() => ({
    downloadDocumentQuery: computed(() =>
      lazyQuery(DownloadEsettExchangeEventsDocument, {
        returnPartialData: false,
        fetchPolicy: 'no-cache',
      })
    ),
    outgoingMessageQuery: computed(() =>
      lazyQuery(GetOutgoingMessagesDocument, { fetchPolicy: 'cache-and-network' })
    ),
  })),
  withComputed(({ outgoingMessageQuery, downloadDocumentQuery }) => ({
    outgoingMessagesTotalCount: computed(
      () => outgoingMessageQuery().data()?.esettExchangeEvents.totalCount ?? 0
    ),
    gridAreaCount: computed(
      () => outgoingMessageQuery().data()?.esettExchangeEvents.gridAreaCount ?? 0
    ),
    outgoingMessages: computed(
      () => outgoingMessageQuery().data()?.esettExchangeEvents.items ?? []
    ),
    loading: outgoingMessageQuery().loading,
    downloading: downloadDocumentQuery().loading,
    hasError: computed(() => outgoingMessageQuery().error() !== undefined),
  })),
  withMethods((store) => ({
    documentIdUpdate: (documentId: string) => {
      patchState(store, (state) => ({
        ...state,
        documentId,
        pageMetaData: { ...state.pageMetaData, pageIndex: 0 },
      }));
    },
    updateFilter: (filters: Partial<DhOutgoingMessagesFilters>) => {
      patchState(store, (state) => ({
        ...state,
        filters,
        pageMetaData: { ...state.pageMetaData, pageIndex: 0 },
      }));
    },
    updateSort: (sortMetaData: Sort) => {
      patchState(store, (state) => ({
        ...state,
        sortMetaData,
        pageMetaData: { ...state.pageMetaData, pageIndex: 0 },
      }));
    },
    updatePage: ({ pageIndex, pageSize }: PageEvent) => {
      patchState(store, (state) => ({ ...state, pageMetaData: { pageIndex, pageSize } }));
    },
    loadOutgoingMessages: (variables: QueryVariables) => {
      const { pageIndex, pageSize } = variables.pageMetaData;
      const { sortDirection, sortProperty } = variables.sortMetaData;
      const { documentId, filters } = variables;
      const {
        calculationTypes,
        messageTypes,
        gridAreas,
        actorNumber,
        statuses,
        period,
        created,
        latestDispatch,
      } = filters;
      store.outgoingMessageQuery().query({
        variables: {
          // 1 needs to be added here because the paginator's `pageIndex` property starts at `0`
          // whereas our endpoint's `pageNumber` param starts at `1`
          pageNumber: pageIndex + 1,
          pageSize: pageSize,
          calculationType: calculationTypes,
          timeSeriesType: messageTypes,
          gridAreaCodes: gridAreas,
          actorNumber: actorNumber,
          documentStatuses: statuses,
          periodInterval: period,
          createdInterval: created,
          sentInterval: latestDispatch,
          documentId: documentId,
          sortProperty,
          sortDirection,
        },
      });
    },
    downloadDocument: () => {
      const { sortDirection, sortProperty } = store.sortMetaData();
      const { documentId, filters } = store;
      const {
        calculationTypes,
        messageTypes,
        gridAreas,
        actorNumber,
        statuses,
        period,
        created,
        latestDispatch,
      } = filters();
      return store.downloadDocumentQuery().query({
        variables: {
          locale: translate('selectedLanguageIso'),
          periodInterval: period,
          createdInterval: created,
          sentInterval: latestDispatch,
          gridAreaCodes: gridAreas,
          calculationType: calculationTypes,
          timeSeriesType: messageTypes,
          documentStatuses: statuses,
          documentId: documentId(),
          actorNumber: actorNumber,
          sortProperty,
          sortDirection,
        },
      });
    },
  })),
  withHooks({
    onInit: (store) => {
      store.loadOutgoingMessages(store.queryVariables());
      effect(() => store.loadOutgoingMessages(store.queryVariables()));
    },
  })
);
