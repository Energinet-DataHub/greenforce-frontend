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
import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { DhChargeMessageArchiveDataAccessStore } from '@energinet-datahub/dh/charges/data-access-api';
import {
  MessageArchiveSearchCriteria,
  MessageArchiveSearchResultItemDto,
} from '@energinet-datahub/dh/shared/domain';
import { PushModule } from '@rx-angular/template';
import { Subject, takeUntil } from 'rxjs';
import { DhChargesPricesDrawerService } from '../dh-charges-prices-drawer.service';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { TranslocoModule } from '@ngneat/transloco';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattIconModule } from '@energinet-datahub/watt/icon';
import { DhMessageArchiveDataAccessBlobApiStore } from '@energinet-datahub/dh/message-archive/data-access-api';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { CommonModule } from '@angular/common';
import { WattBadgeModule } from '@energinet-datahub/watt/badge';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'dh-charge-price-message',
  templateUrl: './dh-charge-price-message.component.html',
  styleUrls: ['./dh-charge-price-message.component.scss'],
  providers: [
    DhChargeMessageArchiveDataAccessStore,
    DhMessageArchiveDataAccessBlobApiStore,
  ],
})
export class DhChargePriceMessageComponent implements OnInit, OnDestroy {
  constructor(
    private dhChargesPricesDrawerService: DhChargesPricesDrawerService,
    private messageArchiveStore: DhChargeMessageArchiveDataAccessStore,
    private blobStore: DhMessageArchiveDataAccessBlobApiStore
  ) {}

  private regexLogNameWithDateFolder = new RegExp(
    /\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\/.*/
  );
  private regexLogNameIsSingleGuid = new RegExp(
    /[\da-zA-Z]{8}-([\da-zA-Z]{4}-){3}[\da-zA-Z]{12}$/
  );

  private destroy$ = new Subject<void>();
  message?: MessageArchiveSearchResultItemDto;

  blobContent$ = this.blobStore.blobContent$;
  blobIsDownloading$ = this.blobStore.isDownloading$;
  blobHasGeneralError$ = this.blobStore.hasGeneralError$;

  searchCriteria: MessageArchiveSearchCriteria = {
    maxItemCount: 1,
    includeRelated: false,
    includeResultsWithoutContent: false,
  };

  ngOnInit(): void {
    this.dhChargesPricesDrawerService.messageId
      .pipe(takeUntil(this.destroy$))
      .subscribe((messageId) => {
        this.searchCriteria.messageId = messageId;
        this.messageArchiveStore.searchLogs(this.searchCriteria);
      });

    this.messageArchiveStore.searchResult$
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        setTimeout(() => {
          if (result) {
            this.message = result;
            const logName = this.findLogName(result.blobContentUri);
            this.blobStore.downloadLog(logName);
          }
        }, 0);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  backToCharge() {
    this.dhChargesPricesDrawerService.removeMessageId();
  }

  downloadLog(resultItem: MessageArchiveSearchResultItemDto) {
    const logName = this.findLogName(resultItem.blobContentUri);
    this.blobStore.downloadLogFile(logName);
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
  declarations: [DhChargePriceMessageComponent],
  exports: [DhChargePriceMessageComponent],
  imports: [
    CommonModule,
    PushModule,
    DhSharedUiDateTimeModule,
    TranslocoModule,
    WattButtonModule,
    WattIconModule,
    WattSpinnerModule,
    WattBadgeModule,
    MatDividerModule,
  ],
})
export class DhChargePriceMessageScam {}
