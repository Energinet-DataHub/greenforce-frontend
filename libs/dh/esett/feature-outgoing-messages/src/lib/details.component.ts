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
import { HttpClient } from '@angular/common/http';
import {
  input,
  inject,
  signal,
  computed,
  Component,
  viewChild,
  afterRenderEffect,
} from '@angular/core';

import { of, switchMap } from 'rxjs';
import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';

import { WATT_TABS } from '@energinet-datahub/watt/tabs';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattCodeComponent } from '@energinet-datahub/watt/code';
import { dayjs, WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';

import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';

import {
  DocumentStatus,
  GetOutgoingMessageByIdDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { DhEmDashFallbackPipe, emDash, streamToFile } from '@energinet-datahub/dh/shared/ui-util';

import { DhResolveModalComponent } from './resolve.componet';
import { DhOutgoingMessageStatusBadgeComponent } from './status.component';

@Component({
  selector: 'dh-outgoing-message-drawer',
  templateUrl: './details.component.html',
  styles: [
    `
      :host {
        display: block;

        .message-heading {
          margin: 0;
          margin-bottom: var(--watt-space-s);
        }

        .heading {
          width: 100%;
        }
      }
    `,
  ],
  imports: [
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
    WattValidationMessageComponent,
    WattDescriptionListItemComponent,

    DhEmDashFallbackPipe,
    DhOutgoingMessageStatusBadgeComponent,
  ],
})
export class DhOutgoingMessageDetailsComponent {
  private httpClient = inject(HttpClient);
  private toastService = inject(WattToastService);
  private modalService = inject(WattModalService);
  private navigation = inject(DhNavigationService);
  private outgoingMessageByIdDocumentQuery = lazyQuery(GetOutgoingMessageByIdDocument);

  outgoingMessage = computed(
    () => this.outgoingMessageByIdDocumentQuery.data()?.esettOutgoingMessageById
  );

  canResolve = computed(
    () =>
      this.outgoingMessage()?.documentStatus === DocumentStatus.Rejected ||
      (this.outgoingMessage()?.documentStatus === DocumentStatus.AwaitingReply &&
        dayjs(new Date()).diff(this.outgoingMessage()?.lastDispatched, 'hours') >= 12)
  );

  messageTypeValue = computed(() => {
    const calculationType = this.outgoingMessage()?.calculationType;
    if (calculationType) {
      return translate('eSett.outgoingMessages.shared.calculationType.' + calculationType);
    }

    return emDash;
  });

  drawer = viewChild.required(WattDrawerComponent);

  // Router param
  id = input.required<string>();

  dispatchDocument = signal<string | undefined>(undefined);
  responseDocument = signal<string | undefined>(undefined);

  loading = this.outgoingMessageByIdDocumentQuery.loading;

  constructor() {
    afterRenderEffect(() => {
      this.drawer().open();
      const id = this.id();

      if (id) {
        this.outgoingMessageByIdDocumentQuery.query({ variables: { documentId: id } });
      }
    });

    afterRenderEffect(() => {
      const outgoingMessage = this.outgoingMessage();

      if (outgoingMessage === undefined) {
        return;
      }

      if (
        outgoingMessage.documentId &&
        outgoingMessage.documentStatus !== DocumentStatus.Received
      ) {
        this.loadDocument(outgoingMessage.dispatchDocumentUrl, this.dispatchDocument.set);
      }

      if (
        outgoingMessage.documentId &&
        ((outgoingMessage.documentStatus !== DocumentStatus.Received &&
          outgoingMessage.documentStatus === DocumentStatus.Accepted) ||
          outgoingMessage.documentStatus === DocumentStatus.Rejected ||
          outgoingMessage.documentStatus === DocumentStatus.ManuallyHandled)
      ) {
        this.loadDocument(outgoingMessage.responseDocumentUrl, this.responseDocument.set);
      }
    });
  }

  onClose(): void {
    this.navigation.navigate('list');
  }

  private loadDocument(url: string | null | undefined, setDocument: (doc: string) => void) {
    if (!url) return;
    this.httpClient.get(url, { responseType: 'text' }).subscribe(setDocument);
  }

  downloadXML(documentType: 'message' | 'receipt') {
    const fileName = `eSett-outgoing-${this.outgoingMessage()?.documentId}-${documentType}`;

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

  openResolveModal() {
    this.modalService.open({
      component: DhResolveModalComponent,
      data: { message: this.outgoingMessage() },
    });
  }
}
