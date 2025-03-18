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
import { Component, inject, signal, input, computed, effect } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_DRAWER } from '@energinet-datahub/watt/drawer';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattCodeComponent } from '@energinet-datahub/watt/code';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { GetBalanceResponsibleByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-balance-responsible-drawer',
  templateUrl: './dh-drawer.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      .message-heading {
        margin: 0;
        margin-bottom: var(--watt-space-s);
      }

      .xml-message-container {
        padding: var(--watt-space-ml);
      }
    `,
  ],
  imports: [
    TranslocoDirective,
    WATT_DRAWER,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    WattDatePipe,
    WattCodeComponent,
    DhEmDashFallbackPipe,
  ],
})
export class DhBalanceResponsibleDrawerComponent {
  private readonly httpClient = inject(HttpClient);
  query = query(GetBalanceResponsibleByIdDocument, () => ({
    variables: { documentId: this.id() },
  }));
  navigation = inject(DhNavigationService);

  balanceResponsibleMessage = computed(() => this.query.data()?.balanceResponsibleById);
  xmlMessage = signal<string | undefined>(undefined);

  // Param value
  id = input.required<string>();

  constructor() {
    effect(() => {
      const storageDocumentUrl = this.balanceResponsibleMessage()?.storageDocumentUrl;
      if (storageDocumentUrl) {
        this.loadDocument(storageDocumentUrl, this.xmlMessage.set);
      }
    });
  }

  private loadDocument(url: string, setDocument: (doc: string) => void) {
    this.httpClient.get(url, { responseType: 'text' }).subscribe(setDocument);
  }
}
