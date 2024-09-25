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
import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { tap } from 'rxjs';

import { VaterFlexComponent, VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattCodeComponent } from '@energinet-datahub/watt/code';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { WATT_DRAWER, type WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

import { DhEmDashFallbackPipe, streamToFile } from '@energinet-datahub/dh/shared/ui-util';
import { ArchivedMessage } from '@energinet-datahub/dh/message-archive/domain';

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
    <watt-drawer
      #drawer
      size="normal"
      *transloco="let t; read: 'messageArchive.details'"
      (closed)="close.emit()"
    >
      <watt-drawer-heading>
        <h2>{{ documentType() }} ({{ businessTransaction() }})</h2>
        <watt-description-list [groupsPerRow]="2">
          <watt-description-list-item [label]="t('messageId')" [value]="messageId()" />
          <watt-description-list-item
            [label]="t('created')"
            [value]="createdAt() | wattDate: 'long'"
          />
          <watt-description-list-item [label]="t('sender')" [value]="sender() | dhEmDashFallback" />
          <watt-description-list-item
            [label]="t('receiver')"
            [value]="receiver() | dhEmDashFallback"
          />
        </watt-description-list>
      </watt-drawer-heading>
      <watt-drawer-actions>
        <watt-button (click)="download()" icon="download" [disabled]="!document()">
          {{ t('download') }}
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

  message = input<ArchivedMessage | undefined>();
  close = output();

  loading = signal(true);
  document = signal('');

  businessTransaction = computed(() => this.message()?.businessTransaction);
  messageId = computed(() => this.message()?.messageId);
  documentType = computed(() => this.message()?.documentType);
  createdAt = computed(() => this.message()?.createdAt);
  sender = computed(() => this.message()?.sender?.displayName);
  receiver = computed(() => this.message()?.receiver?.displayName);

  drawer = viewChild<WattDrawerComponent>('drawer');

  constructor() {
    effect((onCleanup) => {
      const message = this.message();
      const drawer = this.drawer();

      if (!drawer) return;
      if (!message) return drawer.close();

      drawer.open();

      untracked(() => {
        this.document.set('');
        if (!message.documentUrl) return;
        this.loading.set(true);
        const subscription = this.httpClient
          .get(message.documentUrl, { responseType: 'text' })
          .pipe(tap(() => this.loading.set(false)))
          .subscribe((doc) => this.document.set(doc));

        onCleanup(() => subscription.unsubscribe());
      });
    });
  }

  download() {
    // TODO: Consider using .json or .xml based on the document type
    const download = streamToFile({ name: `${this.messageId()}.txt`, type: '' });
    download(this.document()).subscribe();
  }
}
