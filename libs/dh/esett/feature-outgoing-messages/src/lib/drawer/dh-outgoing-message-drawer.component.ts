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
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, Output, EventEmitter, inject } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { Apollo } from 'apollo-angular';
import { RxPush } from '@rx-angular/template/push';
import { Observable, Subscription, map, takeUntil } from 'rxjs';

import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { WATT_TABS } from '@energinet-datahub/watt/tabs';
import { WattCodeComponent } from '@energinet-datahub/watt/code';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDatePipe } from '@energinet-datahub/watt/date';
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
    NgIf,
    TranslocoDirective,
    RxPush,

    WATT_DRAWER,
    WATT_TABS,
    WATT_CARD,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    WattCodeComponent,

    DhEmDashFallbackPipe,
    WattDatePipe,

    DhOutgoingMessageStatusBadgeComponent,
  ],
})
export class DhOutgoingMessageDrawerComponent {
  private apollo = inject(Apollo);
  private http = inject(HttpClient);
  private subscription?: Subscription;

  outgoingMessage: DhOutgoingMessageDetailed | undefined = undefined;

  @ViewChild(WattDrawerComponent)
  drawer: WattDrawerComponent | undefined;

  @Output() closed = new EventEmitter<void>();

  dispatchDocument: Observable<string> | undefined;
  responseDocument: Observable<string> | undefined;

  public open(outgoingMessageId: string): void {
    this.drawer?.open();

    this.loadOutgoingMessage(outgoingMessageId);
  }

  onClose(): void {
    this.closed.emit();
  }

  private loadOutgoingMessage(id: string): void {
    this.subscription?.unsubscribe();

    this.dispatchDocument = undefined;
    this.responseDocument = undefined;

    this.subscription = this.apollo
      .watchQuery({
        errorPolicy: 'all',
        useInitialLoading: true,
        notifyOnNetworkStatusChange: true,
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
            this.outgoingMessage.getDispatchDocumentLink &&
            this.outgoingMessage.documentStatus !== DocumentStatus.Received
          ) {
            this.dispatchDocument = this.loadDocument(this.outgoingMessage.getDispatchDocumentLink);
          }

          if (
            this.outgoingMessage.getResponseDocumentLink &&
            ((this.outgoingMessage.documentStatus !== DocumentStatus.Received &&
              this.outgoingMessage.documentStatus === DocumentStatus.Accepted) ||
              this.outgoingMessage.documentStatus === DocumentStatus.Rejected)
          ) {
            this.responseDocument = this.loadDocument(this.outgoingMessage.getResponseDocumentLink);
          }
        },
      });
  }

  private loadDocument(documentLink: string): Observable<string> {
    return this.http
      .get(documentLink, { responseType: 'arraybuffer' })
      .pipe(map((res) => String.fromCharCode(...new Uint8Array(res))));
  }
}
