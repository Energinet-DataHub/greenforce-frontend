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
import { Component } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-certificate',
  standalone: true,
  template: `
    <watt-card
      variant="solid"
      *transloco="let t; read: 'marketParticipant.actorsOverview.drawer.tabs.certificate'"
    >
      <watt-description-list variant="stack">
        <watt-description-list-item
          [label]="t('thumbprint')"
          [value]="undefined | dhEmDashFallback"
        />
        <watt-description-list-item
          [label]="t('expiryDate')"
          [value]="undefined | dhEmDashFallback"
        />
      </watt-description-list>
    </watt-card>
  `,
  imports: [
    TranslocoDirective,
    DhEmDashFallbackPipe,
    WATT_CARD,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
  ],
})
export class DhCertificateComponent {}
