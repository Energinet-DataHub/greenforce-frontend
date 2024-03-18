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
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { RxLet } from '@rx-angular/template/let';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { WattDatePipe } from '@energinet-datahub/watt/utils/date';
import { ArchivedMessage } from '@energinet-datahub/dh/shared/domain';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';

import {
  WattTableComponent,
  WattTableColumnDef,
  WattTableCellDirective,
  WattTableDataSource,
} from '@energinet-datahub/watt/table';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { ToLowerSort } from '@energinet-datahub/dh/shared/util-table';
import { WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';

import { DhMessageArchiveDrawerComponent } from '../drawer/dh-message-archive-drawer.component';
import { ActorNamePipe } from '../shared/dh-message-archive-actor.pipe';
import { DocumentTypeNamePipe } from '../shared/dh-message-archive-documentTypeName.pipe';
import { DhMessageArchiveStatusComponent } from '../shared/dh-message-archive-status.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-message-archive-log-search-result',
  templateUrl: './dh-message-archive-log-search-result.component.html',
  styleUrls: ['./dh-message-archive-log-search-result.component.scss'],
  imports: [
    WattTableCellDirective,
    TranslocoDirective,
    TranslocoPipe,
    RxLet,
    MatSortModule,
    WattIconComponent,
    WattTableComponent,
    WattEmptyStateComponent,
    WattButtonComponent,
    WattBadgeComponent,
    WattDatePipe,
    WattSpinnerComponent,
    WATT_CARD,
    DhMessageArchiveDrawerComponent,
    DhMessageArchiveStatusComponent,
    ActorNamePipe,
    DocumentTypeNamePipe,
    DhEmDashFallbackPipe,
  ],
})
export class DhMessageArchiveLogSearchResultComponent implements AfterViewInit, OnChanges {
  activeRow: ArchivedMessage | undefined;

  columns: WattTableColumnDef<ArchivedMessage> = {
    messageId: {
      accessor: 'messageId',
    },
    documentType: {
      accessor: 'documentType',
    },
    senderGln: {
      accessor: 'senderGln',
    },
    receiverGln: {
      accessor: 'receiverGln',
    },
    createdDate: {
      accessor: 'createdDate',
    },
  };

  sortMetadata: Sort = {
    active: 'createdDate',
    direction: 'desc',
  };

  readonly dataSource = new WattTableDataSource<ArchivedMessage>();

  @ViewChild(MatSort) matSort!: MatSort;

  @ViewChild(DhMessageArchiveDrawerComponent)
  messageDrawer!: DhMessageArchiveDrawerComponent;

  @Input() searchResult: Array<ArchivedMessage> = [];
  @Input() isSearching = false;
  @Input() hasSearchError = false;
  @Input() isInit = false;
  @Input() actors!: WattDropdownOptions;

  @Output() showLogDownloadPage = new EventEmitter<ArchivedMessage>();
  @Output() downloadLogFile = new EventEmitter<ArchivedMessage>();

  ngOnChanges() {
    this.dataSource.data = this.searchResult;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.matSort;
    this.dataSource.sortingDataAccessor = ToLowerSort();
  }

  onRowClick(row: ArchivedMessage) {
    this.activeRow = row;
    this.messageDrawer.open(row);
  }

  onClosed(): void {
    this.activeRow = undefined;
  }

  onSortChange(sort: Sort): void {
    this.sortMetadata = sort;
  }
}
