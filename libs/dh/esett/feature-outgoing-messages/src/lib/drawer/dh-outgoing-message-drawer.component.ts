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
import { AsyncPipe, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, Output, EventEmitter, inject } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { Apollo } from 'apollo-angular';

import { Subscription, lastValueFrom, map, takeUntil } from 'rxjs';

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
    AsyncPipe,
    TranslocoDirective,

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

  private getOutgoingMessageByIdQuery$ = this.apollo.watchQuery({
    errorPolicy: 'all',
    useInitialLoading: false,
    returnPartialData: true,
    notifyOnNetworkStatusChange: true,
    query: GetOutgoingMessageByIdDocument,
  });

  outgoingMessage: DhOutgoingMessageDetailed | undefined = undefined;

  @ViewChild(WattDrawerComponent)
  drawer: WattDrawerComponent | undefined;

  @Output() closed = new EventEmitter<void>();

  DispatchDocument: Promise<string> | undefined;
  ResponseDocument: Promise<string> | undefined;

  public open(outgoingMessageId: string): void {
    this.drawer?.open();

    this.loadOutgoingMessage(outgoingMessageId);
  }

  onClose(): void {
    this.closed.emit();
  }

  private loadOutgoingMessage(id: string): void {
    this.subscription?.unsubscribe();
    this.DispatchDocument = undefined;
    this.ResponseDocument = undefined;
    this.getOutgoingMessageByIdQuery$.setVariables({ documentId: id });
    this.subscription = this.getOutgoingMessageByIdQuery$.valueChanges
      .pipe(takeUntil(this.closed))
      .subscribe({
        next: (result) => {
          if (
            this.outgoingMessage !== undefined &&
            this.outgoingMessage.documentId === result.data?.eSettOutgoingMessage?.documentId
          )
            return;

          this.outgoingMessage = result.data?.eSettOutgoingMessage;

          if (this.outgoingMessage === undefined) return;

          if (this.outgoingMessage.documentStatus !== DocumentStatus.Received) {
            this.DispatchDocument = lastValueFrom(
              this.http
                .get(this.outgoingMessage.getDispatchDocumentLink, { responseType: 'arraybuffer' })
                .pipe(map((res) => String.fromCharCode(...new Uint8Array(res))))
            );
          }

          if (
            (this.outgoingMessage.documentStatus !== DocumentStatus.Received &&
              this.outgoingMessage.documentStatus === DocumentStatus.Accepted) ||
            this.outgoingMessage.documentStatus === DocumentStatus.Rejected
          ) {
            this.ResponseDocument = lastValueFrom(
              this.http
                .get(this.outgoingMessage.getResponseDocumentLink, { responseType: 'arraybuffer' })
                .pipe(map((res) => String.fromCharCode(...new Uint8Array(res))))
            );
          }
        },
      });
  }
}
