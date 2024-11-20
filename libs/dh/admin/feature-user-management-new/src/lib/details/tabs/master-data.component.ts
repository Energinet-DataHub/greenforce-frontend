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
import { Component, input } from '@angular/core';

import { TranslocoDirective } from '@ngneat/transloco';

import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';

import { UserDetails } from '@energinet-datahub/dh/admin/data-access-api';
import { WattCardComponent } from '@energinet-datahub/watt/card';

import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-user-master-data',
  standalone: true,
  template: `<watt-card
    *transloco="let t; read: 'admin.userManagement.tabs.masterData'"
    variant="solid"
  >
    <watt-description-list variant="stack">
      <watt-description-list-item [label]="t('name')" [value]="user().name" />
      <watt-description-list-item [label]="t('email')" [value]="user().email" />
      <watt-description-list-item
        [label]="t('phone')"
        [value]="user().phoneNumber | dhEmDashFallback"
      />
    </watt-description-list>
  </watt-card>`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [
    TranslocoDirective,

    WattCardComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,

    DhEmDashFallbackPipe,
  ],
})
export class DhUserMasterDataComponent {
  user = input.required<UserDetails>();
}
