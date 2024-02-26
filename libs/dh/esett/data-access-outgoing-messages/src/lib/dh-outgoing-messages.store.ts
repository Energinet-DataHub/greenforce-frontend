import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { endOfDay, startOfDay, sub } from 'date-fns';
import { ComponentStore } from '@ngrx/component-store';

import {
  DocumentStatus,
  ExchangeEventCalculationType,
  InputMaybe,
  Scalars,
  TimeSeriesType,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { dhExchangeSortMetadataMapper } from './dh-sort-metadata-mapper.operator';

type DhOutgoingMessagesFilters = {
  calculationTypes?: InputMaybe<ExchangeEventCalculationType>;
  messageTypes?: InputMaybe<TimeSeriesType>;
  gridAreas?: InputMaybe<string>;
  status?: InputMaybe<DocumentStatus>;
  period?: InputMaybe<Scalars['DateRange']['input']>;
  created?: InputMaybe<Scalars['DateRange']['input']>;
};

interface DhOutgoingMessagesState {
  documentId: string;
  sortMetaData: Sort;
  pageMetaData: Pick<PageEvent, 'pageIndex' | 'pageSize'>;
  filters: DhOutgoingMessagesFilters;
}

const initialState: DhOutgoingMessagesState = {
  documentId: '',
  sortMetaData: {
    active: 'received',
    direction: 'desc',
  },
  pageMetaData: {
    pageIndex: 0,
    pageSize: 100,
  },
  filters: {
    created: {
      start: sub(startOfDay(new Date()), { days: 3 }),
      end: endOfDay(new Date()),
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
