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
import { ReactiveFormsModule } from '@angular/forms';
import { Component, computed, effect, inject, output, signal, viewChild } from '@angular/core';

import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import {
  WattTableCellDirective,
  WattTableColumnDef,
  WattTableComponent,
} from '@energinet-datahub/watt/table';
import { WattDataTableComponent, WattDataFiltersComponent } from '@energinet-datahub/watt/data';

import {
  GetArchivedMessagesQueryVariables,
  SortEnumType,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { ArchivedMessage } from '@energinet-datahub/dh/message-archive/domain';
import { GetArchivedMessagesDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';

import { DhMessageArchiveSearchFiltersComponent } from './filters.component';
import { WattToastService } from '@energinet-datahub/watt/toast';

type Variables = Partial<GetArchivedMessagesQueryVariables>;

@Component({
  selector: 'dh-message-archive-search-table',
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,
    WattTableComponent,
    WattTableCellDirective,
    WattDatePipe,
    WattButtonComponent,
    VaterUtilityDirective,
    WattDataTableComponent,
    WattDataFiltersComponent,
    DhMessageArchiveSearchFiltersComponent,
  ],
  template: `
    <watt-data-table
      *transloco="let t; prefix: 'messageArchive'"
      vater
      inset="ml"
      [searchLabel]="t('searchById')"
      [error]="dataSource.error"
      [ready]="dataSource.called"
      (clear)="reset()"
    >
      <h3>{{ t('results') }}</h3>
      <watt-button variant="secondary" icon="plus" (click)="onNewSearch()">
        {{ t('new') }}
      </watt-button>

      @if (dataSource.called) {
        <watt-data-filters>
          <dh-message-archive-search-filters
            [isSearchingById]="!!dataSource.filter"
            (filter)="fetch($event)"
          />
        </watt-data-filters>
      }

      <watt-table
        *transloco="let resolveHeader; prefix: 'messageArchive.columns'"
        #table
        description="Search result"
        [dataSource]="dataSource"
        [columns]="columns"
        [loading]="dataSource.loading"
        [resolveHeader]="resolveHeader"
        [activeRow]="selection()"
        (rowClick)="onRowClick($event)"
      >
        <ng-container *wattTableCell="columns['documentType']; let row">
          {{ t('documentType.' + row.documentType) }}
        </ng-container>
        <ng-container *wattTableCell="columns['sender']; let row">
          <div>
            {{ row.sender?.displayName }}
            <br />
            <span>{{ row.sender?.glnOrEicNumber }}</span>
          </div>
        </ng-container>
        <ng-container *wattTableCell="columns['receiver']; let row">
          <div>
            {{ row.receiver?.displayName }}
            <br />
            <span>{{ row.receiver?.glnOrEicNumber }}</span>
          </div>
        </ng-container>
        <ng-container *wattTableCell="columns['createdAt']; let row">
          {{ row.createdAt | wattDate: 'long' }}
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
export class DhMessageArchiveSearchTableComponent {
  private readonly toast = inject(WattToastService);
  private readonly transloco = inject(TranslocoService);

  new = output();
  open = output<ArchivedMessage>();
  selection = signal<ArchivedMessage | undefined>(undefined);
  dataTable = viewChild.required(WattDataTableComponent);

  columns: WattTableColumnDef<ArchivedMessage> = {
    messageId: { accessor: 'messageId' },
    documentType: { accessor: 'documentType' },
    sender: { accessor: (m) => m.sender?.displayName },
    receiver: { accessor: (m) => m.receiver?.displayName },
    createdAt: { accessor: 'createdAt' },
  };

  dataSource = new GetArchivedMessagesDataSource({
    skip: true,
    variables: {
      created: { start: new Date(), end: new Date() },
      order: { createdAt: SortEnumType.Desc },
    },
  });

  clearSelection = () => this.selection.set(undefined);

  fetch = (variables: Variables) => this.dataSource.refetch(variables);

  reset = () => {
    this.dataSource.reset();
    this.dataTable().reset();
  };

  onRowClick = (row: ArchivedMessage) => {
    this.selection.set(row);
    this.open.emit(row);
  };

  onNewSearch = () => {
    this.reset();
    this.new.emit();
  };

  private readonly shouldShowLoading = computed(() => {
    return this.dataSource.loading && this.dataSource.data.length > 0;
  });

  constructor() {
    effect(() => {
      const show = this.shouldShowLoading();

      if (show) {
        this.toast.open({
          type: 'loading',
          message: this.transloco.translate('messageArchive.refetching'),
        });
      } else {
        this.toast.dismiss();
      }
    });
  }
}
