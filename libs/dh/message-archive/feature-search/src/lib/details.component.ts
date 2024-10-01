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
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, output, signal, viewChild } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { map, startWith, switchMap, tap } from 'rxjs';

import { VaterFlexComponent, VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattCodeComponent } from '@energinet-datahub/watt/code';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

import { DhEmDashFallbackPipe, streamToFile } from '@energinet-datahub/dh/shared/ui-util';
import { ArchivedMessage } from '@energinet-datahub/dh/message-archive/domain';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'dh-message-archive-search-details',
  standalone: true,
  imports: [
    TranslocoDirective,
    VaterFlexComponent,
    VaterUtilityDirective,
    WATT_DRAWER,
    WattButtonComponent,
    WattCodeComponent,
    WattDatePipe,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    WattSpinnerComponent,
    DhEmDashFallbackPipe,
  ],
  template: `
    <watt-drawer size="normal" *transloco="let t; read: 'messageArchive'" (closed)="onClose()">
      <watt-drawer-heading>
        <h2>{{ t('documentType.' + documentType()) }}</h2>
        <watt-description-list [groupsPerRow]="2">
          <watt-description-list-item [label]="t('details.messageId')" [value]="messageId()" />
          <watt-description-list-item
            [label]="t('details.created')"
            [value]="createdAt() | wattDate: 'long'"
          />
          <watt-description-list-item
            [label]="t('details.sender')"
            [value]="sender() | dhEmDashFallback"
          />
          <watt-description-list-item
            [label]="t('details.receiver')"
            [value]="receiver() | dhEmDashFallback"
          />
        </watt-description-list>
      </watt-drawer-heading>
      <watt-drawer-actions>
        <watt-button (click)="download()" icon="download" [disabled]="!document()">
          {{ t('details.download') }}
        </watt-button>
      </watt-drawer-actions>
      <watt-drawer-content>
        @if (loading()) {
          <vater-flex fill="both">
            <watt-spinner vater center />
          </vater-flex>
        } @else {
          <watt-code [code]="document()" />
        }
      </watt-drawer-content>
    </watt-drawer>
  `,
})
export class DhMessageArchiveSearchDetailsComponent {
  private httpClient = inject(HttpClient);

  close = output();
  message = signal<ArchivedMessage | null>(null);
  loading = signal(true);

  documentChange = toObservable(this.message).pipe(
    tap(() => this.loading.set(true)),
    map((message) => message?.documentUrl),
    switchMap((url) => (!url ? [''] : this.httpClient.get(url, { responseType: 'text' }))),
    tap(() => this.loading.set(false)),
    startWith('')
  );

  document = toSignal(this.documentChange, { requireSync: true });

  messageId = computed(() => this.message()?.messageId);
  documentType = computed(() => this.message()?.documentType);
  createdAt = computed(() => this.message()?.createdAt);
  sender = computed(() => this.message()?.sender?.displayName);
  receiver = computed(() => this.message()?.receiver?.displayName);

  drawer = viewChild(WattDrawerComponent);

  download = () => {
    // TODO: Consider using .json or .xml based on the document type
    const download = streamToFile({ name: `${this.messageId()}.txt`, type: '' });
    download(this.document()).subscribe();
  };

  open = (message: ArchivedMessage) => {
    this.message.set(message);
    this.drawer()?.open();
  };

  onClose = () => {
    this.message.set(null);
    this.drawer()?.close();
    this.close.emit();
  };
}
