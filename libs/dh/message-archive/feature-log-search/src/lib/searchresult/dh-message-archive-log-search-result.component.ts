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
 import { CommonModule } from "@angular/common";
 import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, Output } from "@angular/core";
 import { SearchResultItemDto } from "@energinet-datahub/dh/shared/data-access-api";
 import { TranslocoModule } from '@ngneat/transloco';
 import { LetModule } from '@rx-angular/template';
 import { MatTableModule } from '@angular/material/table';

@Component({
changeDetection: ChangeDetectionStrategy.OnPush,
selector: "dh-message-archive-log-search-result",
templateUrl: "./dh-message-archive-log-search-result.component.html",
styleUrls: ['./dh-message-archive-log-search-result.component.scss'],
})
export class DhMessageArchiveLogSearchResultComponent {
  @Input() searchResult: Array<SearchResultItemDto> = [];
  @Output() downloadLog = new EventEmitter<SearchResultItemDto>();
  displayedColumns: string[] = ['messageId', 'sender', 'logcreateddate', 'traceid', 'loglink', 'logshow'];

  emitDownloadLog(log: SearchResultItemDto)
  {
    this.downloadLog.emit(log);
  }
}
@NgModule({
  declarations: [DhMessageArchiveLogSearchResultComponent],
  exports: [DhMessageArchiveLogSearchResultComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    LetModule,
    MatTableModule
  ],
})
export class DhMessageArchiveLogSearchResultScam {}
