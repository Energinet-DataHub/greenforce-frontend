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
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { LetModule } from '@rx-angular/template';
import { MatTableModule } from '@angular/material/table';
import { TranslocoModule } from '@ngneat/transloco';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { MessageArchiveSearchResultItemDto } from '@energinet-datahub/dh/shared/domain';
import {
  WattButtonModule,
  WattIconModule,
  WattEmptyStateModule,
} from '@energinet-datahub/watt';
import { WattBadgeModule } from '@energinet-datahub/watt/badge';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-message-archive-log-search-result',
  templateUrl: './dh-message-archive-log-search-result.component.html',
  styleUrls: ['./dh-message-archive-log-search-result.component.scss'],
})
export class DhMessageArchiveLogSearchResultComponent {
  @Input() searchResult: Array<MessageArchiveSearchResultItemDto> | null = [];
  @Output() showLogDownloadPage =
    new EventEmitter<MessageArchiveSearchResultItemDto>();
  @Output() downloadLogFile =
    new EventEmitter<MessageArchiveSearchResultItemDto>();
  @Input() isSearching: boolean | null = false;
  displayedColumns: string[] = [
    'messageId',
    'rsmName',
    'sender',
    'createddate',
    'status',
    'logoptions',
  ];

  emitShowLogDownloadPage(log: MessageArchiveSearchResultItemDto) {
    this.showLogDownloadPage.emit(log);
  }

  emitDownlogLogFile(log: MessageArchiveSearchResultItemDto) {
    this.downloadLogFile.emit(log);
  }
}
@NgModule({
  declarations: [DhMessageArchiveLogSearchResultComponent],
  exports: [DhMessageArchiveLogSearchResultComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    LetModule,
    MatTableModule,
    WattIconModule,
    WattEmptyStateModule,
    WattButtonModule,
    WattBadgeModule,
    DhSharedUiDateTimeModule,
  ],
})
export class DhMessageArchiveLogSearchResultScam {}
