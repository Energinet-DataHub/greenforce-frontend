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
import { Component, computed, effect, inject, viewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { WattDatePipe } from '@energinet/watt/date';
import { WattButtonComponent } from '@energinet/watt/button';
import { VaterUtilityDirective } from '@energinet/watt/vater';
import {
  WattTableCellDirective,
  WattTableColumnDef,
  WattTableComponent,
} from '@energinet/watt/table';
import {
  WattDataTableComponent,
  WattDataFiltersComponent,
  WattDataActionsComponent,
} from '@energinet/watt/data';

import { SortEnumType } from '@energinet-datahub/dh/shared/domain/graphql';

import { GetArchivedMessagesDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';
import { MessageArchiveSubPaths } from '@energinet-datahub/dh/core/configuration-routing';
import { DhNavigationService } from '@energinet-datahub/dh/shared/util-navigation';

import { DhMessageArchiveSearchFiltersComponent } from './filters.component';
import { WattToastService } from '@energinet/watt/toast';
import { ArchivedMessage } from '../types';
import { DhMessageArchiveSearchFormService } from '../form.service';

@Component({
  selector: 'dh-message-archive-search-table',
  imports: [
    RouterLink,
    RouterOutlet,
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
    WattDataActionsComponent,
  ],
  providers: [DhNavigationService, DhMessageArchiveSearchFormService],
  template: `
    <watt-data-table
      *transloco="let t; prefix: 'messageArchive'"
      vater
      inset="ml"
      [searchLabel]="t('searchById')"
      [error]="dataSource.error"
      [ready]="dataSource.called"
      [enableCount]="false"
      (clear)="reset()"
    >
      <watt-data-actions>
        <watt-button
          [routerLink]="page.link('search')"
          variant="secondary"
          icon="plus"
          (click)="reset()"
        >
          {{ t('new') }}
        </watt-button>
      </watt-data-actions>

      @if (dataSource.called) {
        <watt-data-filters>
          <dh-message-archive-search-filters [isSearchingById]="!!dataSource.filter" />
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
        (rowClick)="page.navigate('details', $event.messageId)"
      >
        <ng-container *wattTableCell="columns['documentType']; let row">
          {{ t('documentType.' + row.documentType) }}
        </ng-container>
        <ng-container *wattTableCell="columns['sender']; let row">
          {{ row.sender?.displayName }}
        </ng-container>
        <ng-container *wattTableCell="columns['receiver']; let row">
          {{ row.receiver?.displayName }}
        </ng-container>
        <ng-container *wattTableCell="columns['createdAt']; let row">
          {{ row.createdAt | wattDate: 'long' }}
        </ng-container>
      </watt-table>
    </watt-data-table>
    <router-outlet />
  `,
})
export default class DhMessageArchiveSearchTableComponent {
  private readonly toast = inject(WattToastService);
  private readonly transloco = inject(TranslocoService);
  private readonly form = inject(DhMessageArchiveSearchFormService);
  protected readonly page = inject(DhNavigationService<MessageArchiveSubPaths>);

  selection = computed(() => this.dataSource.data.find((i) => i.messageId === this.page.id()));
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

  fetchEffect = effect(() => {
    if (!this.form.submitted()) return;
    this.dataSource.refetch(this.form.values());
  });

  reset = () => {
    this.dataSource.reset();
    this.dataTable().reset();
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
