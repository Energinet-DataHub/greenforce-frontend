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
import { ActivatedRoute } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LetModule } from '@rx-angular/template';
import { Title } from '@angular/platform-browser';
import { TranslocoModule } from '@ngneat/transloco';

import { DhMessageArchiveDataAccessBlobApiStore } from '@energinet-datahub/dh/message-archive/data-access-api';
import { WattSpinnerModule } from '@energinet-datahub/watt';
import { WattBadgeModule } from '@energinet-datahub/watt/badge';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-message-archive-log-search-blob-content',
  templateUrl: './dh-message-archive-log-search-blob-content.component.html',
  styleUrls: ['./dh-message-archive-log-search-blob-content.component.scss'],
  providers: [DhMessageArchiveDataAccessBlobApiStore],
})
export class DhMessageArchiveLogSearchBlobContentComponent
  implements OnDestroy
{
  blobContent$ = this.blobStore.blobContent$;
  isDownloading$ = this.blobStore.isDownloading$;
  hasGeneralError$ = this.blobStore.hasGeneralError$;
  messageId = '';
  traceId = '';

  constructor(
    private blobStore: DhMessageArchiveDataAccessBlobApiStore,
    private route: ActivatedRoute,
    private title: Title
  ) {
    this.route.params.subscribe((params) => {
      const logName = params['logname'];
      const decodedLogName = decodeURIComponent(logName);
      this.blobStore.downloadLog(decodedLogName);
    });

    this.messageId = sessionStorage.getItem('messageId') ?? '...';
    this.traceId = sessionStorage.getItem('traceId') ?? '...';
    this.title.setTitle(this.messageId);
  }

  ngOnDestroy(): void {
    this.title.setTitle('DataHub');
  }
}

@NgModule({
  declarations: [DhMessageArchiveLogSearchBlobContentComponent],
  exports: [DhMessageArchiveLogSearchBlobContentComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    LetModule,
    WattSpinnerModule,
    WattBadgeModule,
  ],
})
export class DhMessageArchiveLogSearchBlobContentScam {}
