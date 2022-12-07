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
import { Component, Input, NgModule, ViewChild } from '@angular/core';
import { MessageArchiveSearchResultItemDto } from '@energinet-datahub/dh/shared/domain';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import {
  WattDrawerComponent,
  WattDrawerModule,
} from '@energinet-datahub/watt/drawer';
import { WattIconModule } from '@energinet-datahub/watt/icon';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { TranslocoModule } from '@ngneat/transloco';
import { MatDividerModule } from '@angular/material/divider';
import { DhMessageArchiveStatusComponentScam } from '../shared/dh-message-archive-status.component';
import { WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { DhMessageArchiveDataAccessBlobApiStore } from '@energinet-datahub/dh/message-archive/data-access-api';

import { ActorNamePipe } from '../shared/dh-message-archive-actor.pipe';
import { DocumentTypeNamePipe } from '../shared/dh-message-archive-documentTypeName.pipe';
import { DhEmDashFallbackPipeScam } from '@energinet-datahub/dh/metering-point/shared/ui-util';

@Component({
  selector: 'dh-message-archive-drawer',
  templateUrl: './dh-message-archive-drawer.component.html',
  styleUrls: ['./dh-message-archive-drawer.component.scss'],
})
export class DhMessageArchiveDrawerComponent {
  @ViewChild('drawer') drawer!: WattDrawerComponent;
  @Input() actors: WattDropdownOptions | null = null;
  private regexLogNameWithDateFolder = new RegExp(
    /\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\/.*/
  );
  private regexLogNameIsSingleGuid = new RegExp(
    /[\da-zA-Z]{8}-([\da-zA-Z]{4}-){3}[\da-zA-Z]{12}$/
  );

  message: MessageArchiveSearchResultItemDto | null = null;
  messageLog$ = this.blobStore.select((x) => x.blobContent);

  constructor(private blobStore: DhMessageArchiveDataAccessBlobApiStore) {}

  open(message: MessageArchiveSearchResultItemDto) {
    this.blobStore.downloadLog(this.findLogName(message.blobContentUri));
    this.message = message;
    this.drawer.open();
  }

  onClose() {
    this.drawer.close();
  }

  downloadLogFile() {
    this.blobStore.downloadLogFile(
      this.findLogName(this.message?.blobContentUri ?? '')
    );
  }

  findLogName(logUrl: string): string {
    if (this.regexLogNameWithDateFolder.test(logUrl)) {
      const match = this.regexLogNameWithDateFolder.exec(logUrl);
      return match != null ? match[0] : '';
    } else if (this.regexLogNameIsSingleGuid.test(logUrl)) {
      const match = this.regexLogNameIsSingleGuid.exec(logUrl);
      return match != null ? match[0] : '';
    }

    return '';
  }
}

@NgModule({
  declarations: [DhMessageArchiveDrawerComponent],
  exports: [DhMessageArchiveDrawerComponent],
  imports: [
    CommonModule,
    WattDrawerModule,
    TranslocoModule,
    WattIconModule,
    DhSharedUiDateTimeModule,
    DhMessageArchiveStatusComponentScam,
    MatDividerModule,
    ActorNamePipe,
    DocumentTypeNamePipe,
    WattButtonModule,
    DhEmDashFallbackPipeScam,
  ],
})
export class DhMessageArchiveDrawerScam {}
