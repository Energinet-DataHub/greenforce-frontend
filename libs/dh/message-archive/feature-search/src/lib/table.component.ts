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
import { Component, OnInit, output, signal, viewChild } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDataTableComponent, WattDataFiltersComponent } from '@energinet-datahub/watt/data';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattTableColumnDef, WATT_TABLE } from '@energinet-datahub/watt/table';

import {
  GetArchivedMessagesQueryVariables,
  SortEnumType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { GetArchivedMessagesDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';
import { ArchivedMessage } from '@energinet-datahub/dh/message-archive/domain';
import { WattFilterChipComponent } from '@energinet-datahub/watt/chip';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WattFormChipDirective } from '@energinet-datahub/watt/field';

type Variables = Partial<GetArchivedMessagesQueryVariables>;

@Component({
  selector: 'dh-message-archive-search-table',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    VaterUtilityDirective,
    WATT_TABLE,
    WattButtonComponent,
    WattDataFiltersComponent,
    WattDataTableComponent,
    WattDatePipe,
    WattEmptyStateComponent,
    WattFilterChipComponent,
    WattFormChipDirective,
  ],
  template: `
    <watt-data-table
      *transloco="let t; read: 'messageArchive'"
      vater
      inset="ml"
      [searchLabel]="t('searchById')"
      [error]="dataSource.error"
      [ready]="dataSource.called"
      (clear)="reset()"
    >
      <h3>{{ t('results') }}</h3>
      <watt-button variant="secondary" icon="plus" (click)="new.emit()">
        {{ t('new') }}
      </watt-button>
      @if (dataSource.filter) {
        <watt-data-filters>
          <form [formGroup]="form">
            <watt-filter-chip [formControl]="this.form.controls.includeRelated">
              {{ t('filters.includeRelated') }}
            </watt-filter-chip>
          </form>
        </watt-data-filters>
      }
      <watt-table
        *transloco="let resolveHeader; read: 'messageArchive.columns'"
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
export class DhMessageArchiveSearchTableComponent implements OnInit {
  new = output();
  open = output<ArchivedMessage>();
  selection = signal<ArchivedMessage | undefined>(undefined);
  dataTable = viewChild.required(WattDataTableComponent);
  form = new FormGroup({ includeRelated: new FormControl(false) });
  filterChanges = this.form.valueChanges.pipe(takeUntilDestroyed());

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

  ngOnInit() {
    this.filterChanges.subscribe((variables) => this.dataSource.refetch(variables));
  }

  clearSelection = () => this.selection.set(undefined);

  fetch = (variables: Variables) => {
    this.dataTable().reset();
    this.dataSource.refetch(variables);
  };

  reset = () => {
    this.dataTable().reset();
    this.dataSource.reset();
  };

  onRowClick = (row: ArchivedMessage) => {
    this.selection.set(row);
    this.open.emit(row);
  };
}
