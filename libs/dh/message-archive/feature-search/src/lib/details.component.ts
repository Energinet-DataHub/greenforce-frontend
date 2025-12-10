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
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, output, signal, viewChild } from '@angular/core';

import { translate, TranslocoDirective } from '@jsverse/transloco';

import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet/watt/description-list';

import { WattCodeComponent } from '@energinet/watt/code';
import { WattSpinnerComponent } from '@energinet/watt/spinner';
import { WattDatePipe, wattFormatDate } from '@energinet/watt/date';
import { WATT_DRAWER, WattDrawerComponent } from '@energinet/watt/drawer';
import { VaterFlexComponent, VaterUtilityDirective } from '@energinet/watt/vater';

import { ArchivedMessage } from '@energinet-datahub/dh/message-archive/domain';
import {
  DhDownloadButtonComponent,
  DhEmDashFallbackPipe,
  toFile,
} from '@energinet-datahub/dh/shared/ui-util';
import { dhAppEnvironmentToken } from '@energinet-datahub/dh/shared/environments';

@Component({
  selector: 'dh-message-archive-search-details',
  imports: [
    TranslocoDirective,
    VaterFlexComponent,
    VaterUtilityDirective,
    WATT_DRAWER,
    WattDatePipe,
    WattCodeComponent,
    WattSpinnerComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    DhEmDashFallbackPipe,
    DhDownloadButtonComponent,
  ],
  template: `
    <watt-drawer size="normal" *transloco="let t; prefix: 'messageArchive'" (closed)="onClose()">
      <watt-drawer-heading>
        @if (documentType()) {
          <h2>{{ t('documentType.' + documentType()) }}</h2>
        }
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
        <dh-download-button
          [disabled]="!document.hasValue()"
          (clicked)="download()"
        />
      </watt-drawer-actions>
      <watt-drawer-content>
        @if (document.isLoading()) {
          <vater-flex fill="both">
            <watt-spinner vater center />
          </vater-flex>
        } @else {
          <watt-code
            [code]="document.value()"
            (discoveredLanguage)="discoveredLanguage.set($event)"
          />
        }
      </watt-drawer-content>
    </watt-drawer>
  `,
})
export class DhMessageArchiveSearchDetailsComponent {
  private env = inject(dhAppEnvironmentToken);
  closed = output();
  message = signal<ArchivedMessage | null>(null);

  document = httpResource.text(() => this.message()?.documentUrl ?? undefined);

  messageId = computed(() => this.message()?.messageId);
  documentType = computed(() => this.message()?.documentType);
  createdAt = computed(() => this.message()?.createdAt);
  sender = computed(() => this.message()?.sender?.displayName);
  receiver = computed(() => this.message()?.receiver?.displayName);

  discoveredLanguage = signal<'json' | 'xml' | 'unknown'>('unknown');

  type = computed(() => {
    if (this.discoveredLanguage() === 'json') return 'application/json';
    if (this.discoveredLanguage() === 'xml') return 'application/xml';
    return 'text/plain';
  });

  ext = computed(() => {
    if (this.discoveredLanguage() === 'json') return 'json';
    if (this.discoveredLanguage() === 'xml') return 'xml';
    return 'txt';
  });

  drawer = viewChild(WattDrawerComponent);

  download() {
    const message = translate('messageArchive.drawer.message');
    const envDate = translate('shared.downloadNameParams', {
      datetime: wattFormatDate(new Date(), 'long'),
      env: translate(`environmentName.${this.env.current}`),
    });
    const filename = `DataHub ${message} - ${this.messageId()} - ${envDate}.${this.ext()}`;

    toFile({
      name: filename,
      type: this.type(),
      data: this.document.value(),
    });
  }

  open(message: ArchivedMessage) {
    this.message.set(message);
    this.drawer()?.open();
  }

  onClose() {
    this.message.set(null);
    this.drawer()?.close();
    this.closed.emit();
  }
}
