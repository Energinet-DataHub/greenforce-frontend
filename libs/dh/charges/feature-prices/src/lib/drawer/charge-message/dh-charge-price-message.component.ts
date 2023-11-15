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
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import {
  DhChargeMessageArchiveDataAccessStore,
  DhMarketParticipantDataAccessApiStore,
} from '@energinet-datahub/dh/charges/data-access-api';
import { DhMessageArchiveDataAccessBlobApiStore } from '@energinet-datahub/dh/message-archive/data-access-api';
import { ChargeMarketParticipantV1Dto, ArchivedMessage } from '@energinet-datahub/dh/shared/domain';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { TranslocoModule } from '@ngneat/transloco';
import { RxLet } from '@rx-angular/template/let';
import { RxPush } from '@rx-angular/template/push';
import { DhChargesPricesDrawerService } from '../dh-charges-prices-drawer.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RxPush,
    RxLet,
    WattEmptyStateComponent,
    WattDatePipe,
    TranslocoModule,
    WattButtonComponent,
    WattIconComponent,
    WattSpinnerComponent,
    WattBadgeComponent,
    MatDividerModule,
  ],
  selector: 'dh-charge-price-message',
  templateUrl: './dh-charge-price-message.component.html',
  styleUrls: ['./dh-charge-price-message.component.scss'],
  providers: [DhChargeMessageArchiveDataAccessStore, DhMessageArchiveDataAccessBlobApiStore],
})
export class DhChargePriceMessageComponent implements OnInit {
  private dhChargesPricesDrawerService = inject(DhChargesPricesDrawerService);
  private chargeMessageArchiveStore = inject(DhChargeMessageArchiveDataAccessStore);
  private marketParticipantStore = inject(DhMarketParticipantDataAccessApiStore);
  private blobStore = inject(DhMessageArchiveDataAccessBlobApiStore);
  private _destroyRef = inject(DestroyRef);
  private _regexLogNameWithDateFolder = new RegExp(
    /\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\/.*/
  );
  private _regexLogNameIsSingleGuid = new RegExp(
    /[\da-zA-Z]{8}-([\da-zA-Z]{4}-){3}[\da-zA-Z]{12}$/
  );

  message?: ArchivedMessage;
  senderMarketParticipant?: ChargeMarketParticipantV1Dto;

  messageHasGeneralError$ = this.chargeMessageArchiveStore.hasGeneralError$;
  messageIsSearching$ = this.chargeMessageArchiveStore.isSearching$;

  blobContent$ = this.blobStore.blobContent$;
  blobIsDownloading$ = this.blobStore.isDownloading$;
  blobHasGeneralError$ = this.blobStore.hasGeneralError$;

  today = new Date();
  tomorrow = new Date(this.today.setDate(this.today.getDate() + 1));

  ngOnInit(): void {
    this.chargeMessageArchiveStore.searchResult$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((result) => {
        setTimeout(() => {
          if (result) {
            this.message = result;
          }
        }, 0);
      });
  }

  backToCharge() {
    this.dhChargesPricesDrawerService.removeMessage();
  }

  downloadLog() {
    if (this.message == undefined) return;
  }

  findLogName(logUrl: string): string {
    if (this._regexLogNameWithDateFolder.test(logUrl)) {
      const match = this._regexLogNameWithDateFolder.exec(logUrl);
      return match != null ? match[0] : '';
    }
    if (this._regexLogNameIsSingleGuid.test(logUrl)) {
      const match = this._regexLogNameIsSingleGuid.exec(logUrl);
      return match != null ? match[0] : '';
    }

    return '';
  }
}
