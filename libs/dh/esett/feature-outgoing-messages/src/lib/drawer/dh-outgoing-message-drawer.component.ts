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
import { Component, ViewChild, Output, EventEmitter, inject, signal } from '@angular/core';

import { Apollo } from 'apollo-angular';
import { RxPush } from '@rx-angular/template/push';
import { Subscription, of, switchMap, takeUntil } from 'rxjs';
import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';

import { WATT_TABS } from '@energinet-datahub/watt/tabs';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDatePipe } from '@energinet-datahub/watt/utils/date';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattCodeComponent } from '@energinet-datahub/watt/code';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import { DhEmDashFallbackPipe, emDash, streamToFile } from '@energinet-datahub/dh/shared/ui-util';

import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import {
  DocumentStatus,
  GetOutgoingMessageByIdDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhOutgoingMessageDetailed } from '../dh-outgoing-message';
import { DhOutgoingMessageStatusBadgeComponent } from '../status-badge/dh-outgoing-message-status-badge.component';

@Component({
  selector: 'dh-outgoing-message-drawer',
  standalone: true,
  templateUrl: './dh-outgoing-message-drawer.component.html',
  styles: [
    `
      :host {
        display: block;

        .message-heading {
          margin: 0;
          margin-bottom: var(--watt-space-s);
        }
      }
    `,
  ],
  imports: [
    RxPush,
    TranslocoPipe,
    TranslocoDirective,

    VaterStackComponent,

    WATT_TABS,
    WATT_CARD,
    WATT_DRAWER,
    WattDatePipe,
    WattCodeComponent,
    WattButtonComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,

    DhEmDashFallbackPipe,
    DhOutgoingMessageStatusBadgeComponent,
  ],
})
export class DhOutgoingMessageDrawerComponent {
  private readonly apollo = inject(Apollo);
  private readonly toastService = inject(WattToastService);
  private readonly httpClient = inject(HttpClient);

  private subscription?: Subscription;

  outgoingMessage: DhOutgoingMessageDetailed | undefined = undefined;

  @ViewChild(WattDrawerComponent)
  drawer: WattDrawerComponent | undefined;

  @Output() closed = new EventEmitter<void>();

  dispatchDocument = signal<string | undefined>(undefined);
  responseDocument = signal<string | undefined>(undefined);

  get messageTypeValue(): string {
    if (this.outgoingMessage?.calculationType) {
      return translate(
        'eSett.outgoingMessages.shared.calculationType.' + this.outgoingMessage?.calculationType
      );
    }

    return emDash;
  }

  public open(outgoingMessageId: string): void {
    this.drawer?.open();

    this.loadOutgoingMessage(outgoingMessageId);
  }

  onClose(): void {
    this.closed.emit();
  }

  private loadOutgoingMessage(id: string): void {
    this.subscription?.unsubscribe();

    this.dispatchDocument.set(undefined);
    this.responseDocument.set(undefined);

    this.subscription = this.apollo
      .watchQuery({
        errorPolicy: 'all',
        query: GetOutgoingMessageByIdDocument,
        variables: { documentId: id },
      })
      .valueChanges.pipe(takeUntil(this.closed))
      .subscribe({
        next: (result) => {
          this.outgoingMessage = result.data?.esettOutgoingMessageById;

          if (this.outgoingMessage === undefined) {
            return;
          }

          if (
            this.outgoingMessage.documentId &&
            this.outgoingMessage.documentStatus !== DocumentStatus.Received
          ) {
            this.loadDocument(this.outgoingMessage.dispatchDocumentUrl, this.dispatchDocument.set);
          }

          if (
            this.outgoingMessage.documentId &&
            ((this.outgoingMessage.documentStatus !== DocumentStatus.Received &&
              this.outgoingMessage.documentStatus === DocumentStatus.Accepted) ||
              this.outgoingMessage.documentStatus === DocumentStatus.Rejected)
          ) {
            this.loadDocument(this.outgoingMessage.responseDocumentUrl, this.responseDocument.set);
          }
        },
      });
  }

  private loadDocument(url: string | null | undefined, setDocument: (doc: string) => void) {
    if (!url) return;
    this.httpClient.get(url, { responseType: 'text' }).subscribe(setDocument);
  }

  downloadXML(documentType: 'message' | 'receipt') {
    const fileName = `eSett-outgoing-${this.outgoingMessage?.documentId}-${documentType}`;

    const fileOptions = {
      name: fileName,
      type: 'text/xml',
    };

    const document$ =
      documentType === 'message' ? of(this.dispatchDocument()) : of(this.responseDocument());

    document$.pipe(switchMap(streamToFile(fileOptions))).subscribe({
      error: () => {
        this.toastService.open({
          type: 'danger',
          message: translate('shared.downloadFailed'),
        });
      },
    });
  }
}
