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
import { computed, inject } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { dayjs } from '@energinet-datahub/watt/date';

import { dhExchangeSortMetadataMapper } from './dh-sort-metadata-mapper.operator';
import { DhOutgoingMessagesFilters } from './dh-outgoing-messages-filters';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Apollo } from 'apollo-angular';
import { EMPTY, catchError, pipe, switchMap, tap } from 'rxjs';
import {
  DownloadEsettExchangeEventsDocument,
  GetOutgoingMessagesDocument,
  GetStatusReportDocument,
  ResendExchangeMessagesDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { ErrorState, LoadingState } from '@energinet-datahub/dh/shared/data-access-api';

import type { ResultOf } from '@graphql-typed-document-node/core';
import { exportToCSVRaw } from '@energinet-datahub/dh/shared/ui-util';
import { translate } from '@ngneat/transloco';
import { WattToastService } from '@energinet-datahub/watt/toast';

type OutgoingMessageResponse = ResultOf<typeof GetOutgoingMessagesDocument>['esettExchangeEvents'];

type QueryVariables = {
  documentId: string;
  sortMetaData: Sort;
  pageMetaData: Pick<PageEvent, 'pageIndex' | 'pageSize'>;
  filters: DhOutgoingMessagesFilters;
};

type DhOutgoingMessagesState = {
  queryVariables: QueryVariables;
  loadingState: LoadingState | ErrorState;
  outgoingMessagesResponse: OutgoingMessageResponse;
};

const initialState: DhOutgoingMessagesState = {
  queryVariables: {
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
  },
  loadingState: LoadingState.INIT,
  outgoingMessagesResponse: {} as OutgoingMessageResponse,
};

export const DhOutgoingMessageSignalStore = signalStore(
  withState(initialState),
  withComputed(({ loadingState, outgoingMessagesResponse }) => ({
    isLoading: computed(() => loadingState() === LoadingState.LOADING),
    hasError: computed(() => loadingState() === ErrorState.GENERAL_ERROR),
    outgoingMessages: computed(() => outgoingMessagesResponse().items),
    totalCount: computed(() => outgoingMessagesResponse().totalCount),
    gridAreaCount: computed(() => outgoingMessagesResponse().gridAreaCount),
  })),
  withMethods((store, apollo = inject(Apollo), toastService = inject(WattToastService)) => ({
    updateDocumentId: (documentId: string) => {
      patchState(store, (state) => ({
        ...state,
        queryVariables: {
          ...state.queryVariables,
          documentId,
          pageMetaData: { ...state.queryVariables.pageMetaData, pageIndex: 0 },
        },
      }));
    },
    updateFilters: (filters: DhOutgoingMessagesFilters): void => {
      patchState(store, (state) => ({
        ...state,
        queryVariables: {
          ...state.queryVariables,
          filters: { ...state.queryVariables.filters, ...filters },
          pageMetaData: { ...state.queryVariables.pageMetaData, pageIndex: 0 },
        },
      }));
    },
    updateSort: (sort: Sort) => {
      patchState(store, (state) => ({
        ...state,
        queryVariables: {
          ...state.queryVariables,
          sortMetaData: sort,
          pageMetaData: { ...state.queryVariables.pageMetaData, pageIndex: 0 },
        },
      }));
    },
    updatePaging: ({ pageIndex, pageSize }: PageEvent) => {
      patchState(store, (state) => ({ ...state, pageMetaData: { pageIndex, pageSize } }));
    },
    resend: () => {
      apollo
        .mutate({
          mutation: ResendExchangeMessagesDocument,
          refetchQueries: [GetStatusReportDocument],
        })
        .subscribe((data) => {
          if (data.loading) {
            patchState(store, (state) => ({ ...state, loadingState: LoadingState.LOADING }));
            return;
          }

          if (data.errors) {
            patchState(store, (state) => ({
              ...state,
              loadingState: ErrorState.GENERAL_ERROR,
            }));
            return;
          }

          patchState(store, (state) => ({
            ...state,
            loadingState: LoadingState.LOADED,
          }));
        });
    },
    requestOutgoingMessages: rxMethod<QueryVariables>(
      pipe(
        switchMap(({ documentId, filters, pageMetaData, sortMetaData }) => {
          const { sortProperty, sortDirection } = dhExchangeSortMetadataMapper(sortMetaData);
          const { pageIndex, pageSize } = pageMetaData;
          const {
            calculationType,
            messageTypes: timeSeriesType,
            gridAreaCode,
            actorNumber,
            status: documentStatus,
            period: periodInterval,
            created: createdInterval,
            latestDispatch: sentInterval,
          } = filters;

          return apollo
            .watchQuery({
              fetchPolicy: 'cache-and-network',
              query: GetOutgoingMessagesDocument,
              variables: {
                // 1 needs to be added here because the paginator's `pageIndex` property starts at `0`
                // whereas our endpoint's `pageNumber` param starts at `1`
                pageNumber: pageIndex + 1,
                pageSize,
                calculationType,
                timeSeriesType,
                gridAreaCode,
                actorNumber,
                documentStatus,
                periodInterval,
                createdInterval,
                sentInterval,
                documentId,
                sortProperty,
                sortDirection,
              },
            })
            .valueChanges.pipe(
              catchError(() => {
                patchState(store, (state) => ({
                  ...state,
                  loadingState: ErrorState.GENERAL_ERROR,
                  outgoingMessagesResponse: {} as OutgoingMessageResponse,
                }));
                return EMPTY;
              }),
              tap((data) => {
                if (data.loading) {
                  patchState(store, (state) => ({ ...state, loadingState: LoadingState.LOADING }));
                  return;
                }

                if (data.error || data.errors) {
                  patchState(store, (state) => ({
                    ...state,
                    loadingState: ErrorState.GENERAL_ERROR,
                  }));
                  return;
                }

                const outgoingMessages = data?.data?.esettExchangeEvents;

                patchState(store, (state) => ({
                  ...state,
                  outgoingMessagesResponse: outgoingMessages,
                  loadingState: LoadingState.LOADED,
                }));
              })
            );
        })
      )
    ),
    download: rxMethod<QueryVariables>(
      pipe(
        switchMap(({ documentId, filters, sortMetaData }) => {
          const { sortProperty, sortDirection } = dhExchangeSortMetadataMapper(sortMetaData);
          const {
            calculationType,
            messageTypes: timeSeriesType,
            gridAreaCode,
            actorNumber,
            status: documentStatus,
            period: periodInterval,
            created: createdInterval,
            latestDispatch: sentInterval,
          } = filters;

          return apollo
            .query({
              returnPartialData: false,
              fetchPolicy: 'no-cache',
              query: DownloadEsettExchangeEventsDocument,
              variables: {
                locale: translate('selectedLanguageIso'),
                periodInterval,
                createdInterval,
                sentInterval,
                gridAreaCode,
                calculationType,
                timeSeriesType,
                documentStatus,
                documentId,
                actorNumber,
                sortProperty,
                sortDirection,
              },
            })
            .pipe(
              tap({
                next: ({ loading, data, error, errors }) => {
                  if (loading) {
                    patchState(store, (state) => ({
                      ...state,
                      loadingState: LoadingState.LOADING,
                    }));
                    return;
                  }

                  if (error || errors) {
                    patchState(store, (state) => ({
                      ...state,
                      loadingState: ErrorState.GENERAL_ERROR,
                    }));
                    toastService.open({
                      message: translate('shared.error.message'),
                      type: 'danger',
                    });
                    return;
                  }

                  exportToCSVRaw({
                    content: data?.downloadEsettExchangeEvents ?? '',
                    fileName: 'eSett-outgoing-messages',
                  });
                },
                error: () => {
                  patchState(store, (state) => ({
                    ...state,
                    loadingState: ErrorState.GENERAL_ERROR,
                  }));
                  toastService.open({
                    message: translate('shared.error.message'),
                    type: 'danger',
                  });
                },
              })
            );
        })
      )
    ),
  })),
  withHooks({
    onInit: (store) => store.requestOutgoingMessages(store.queryVariables),
  })
);
